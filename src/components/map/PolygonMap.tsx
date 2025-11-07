import { useCallback, useState, useRef } from "react";
import { GoogleMap, Polygon, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Button } from "../ui/button";
import { MapPin, Trash2, Undo, Navigation, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Coordinate {
  lat: number;
  lng: number;
}

interface PolygonMapProps {
  coordinates?: Coordinate[];
  onChange?: (coordinates: Coordinate[]) => void;
  center?: Coordinate;
  zoom?: number;
  apiKey: string;
  editable?: boolean;
  className?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 5.6037, // Ghana center
  lng: -0.187,
};

const PolygonMap = ({
  coordinates = [],
  onChange,
  center = defaultCenter,
  zoom = 8,
  apiKey,
  editable = true,
  className,
}: PolygonMapProps) => {
  const [points, setPoints] = useState<Coordinate[]>(coordinates);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!editable || !isDrawing || !e.latLng) return;

      const newPoint: Coordinate = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      const updatedPoints = [...points, newPoint];
      setPoints(updatedPoints);
      onChange?.(updatedPoints);
    },
    [editable, isDrawing, points, onChange]
  );

  const handleRemoveLastPoint = () => {
    if (points.length === 0) return;
    const updatedPoints = points.slice(0, -1);
    setPoints(updatedPoints);
    onChange?.(updatedPoints);
  };

  const handleClearAll = () => {
    setPoints([]);
    onChange?.([]);
  };

  const handleToggleDrawing = () => {
    setIsDrawing(!isDrawing);
  };

  const handleAddCurrentLocation = () => {
    if (!editable) return;

    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPoint: Coordinate = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Update current location marker
        setCurrentLocation(newPoint);

        // Add to points
        const updatedPoints = [...points, newPoint];
        setPoints(updatedPoints);
        onChange?.(updatedPoints);

        // Pan map to new location
        if (mapRef.current) {
          mapRef.current.panTo(newPoint);
          mapRef.current.setZoom(Math.max(mapRef.current.getZoom() || 15, 15));
        }

        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Failed to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleMarkerDragEnd = (index: number, e: google.maps.MapMouseEvent) => {
    if (!editable || !e.latLng) return;

    const updatedPoints = [...points];
    updatedPoints[index] = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setPoints(updatedPoints);
    onChange?.(updatedPoints);
  };

  // Polygon options
  const polygonOptions = {
    fillColor: "#3b82f6",
    fillOpacity: 0.3,
    strokeColor: "#2563eb",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
  };

  // Calculate polygon center for auto-zoom
  const getPolygonCenter = (coords: Coordinate[]): Coordinate => {
    if (coords.length === 0) return center;

    const bounds = new google.maps.LatLngBounds();
    coords.forEach((coord) => bounds.extend(coord));
    const mapCenter = bounds.getCenter();

    return {
      lat: mapCenter.lat(),
      lng: mapCenter.lng(),
    };
  };

  // Auto-fit bounds when polygon changes
  const fitBounds = useCallback(() => {
    if (!mapRef.current || points.length < 2) return;

    const bounds = new google.maps.LatLngBounds();
    points.forEach((point) => bounds.extend(point));
    mapRef.current.fitBounds(bounds);
  }, [points]);

  if (loadError) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4">
        <p className="text-destructive text-sm font-medium">Error loading Google Maps</p>
        <p className="text-destructive/80 text-xs mt-1">
          {loadError.message || "Failed to load maps. Please check your API key."}
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="rounded-md border bg-muted p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Map Controls */}
      {editable && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={isDrawing ? "default" : "outline"}
            size="sm"
            onClick={handleToggleDrawing}
          >
            <MapPin className="h-4 w-4 mr-1" />
            {isDrawing ? "Drawing Mode (Click map to add points)" : "Start Drawing"}
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleAddCurrentLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-1" />
                Add Current Location
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveLastPoint}
            disabled={points.length === 0}
          >
            <Undo className="h-4 w-4 mr-1" />
            Undo Last
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={points.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fitBounds}
            disabled={points.length < 2}
          >
            Fit to Bounds
          </Button>
        </div>
      )}

      {/* Location Error */}
      {locationError && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3">
          <p className="text-destructive text-sm font-medium">Location Error</p>
          <p className="text-destructive/80 text-xs mt-1">{locationError}</p>
        </div>
      )}

      {/* Points Info */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {points.length === 0
            ? "No points added yet"
            : `${points.length} point${points.length !== 1 ? "s" : ""} added`}
          {points.length >= 3 && " (Polygon formed)"}
        </p>
        {isDrawing && (
          <p className="text-primary font-medium">Click on the map to add points</p>
        )}
      </div>

      {/* Google Map */}
      <div className="rounded-md overflow-hidden border">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={points.length > 0 ? getPolygonCenter(points) : center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {/* Render markers for each point */}
          {points.map((point, index) => (
            <Marker
              key={index}
              position={point}
              label={{
                text: `${index + 1}`,
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              draggable={editable}
              onDragEnd={(e) => handleMarkerDragEnd(index, e)}
            />
          ))}

          {/* Render current location marker (pulsing blue dot) */}
          {currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              }}
              title="Your current location"
            />
          )}

          {/* Render polygon if at least 3 points */}
          {points.length >= 3 && <Polygon paths={points} options={polygonOptions} />}
        </GoogleMap>
      </div>

      {/* Coordinates List */}
      {points.length > 0 && (
        <details className="rounded-md border p-3">
          <summary className="cursor-pointer text-sm font-medium">
            View Coordinates ({points.length} points)
          </summary>
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {points.map((point, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs bg-muted p-2 rounded"
              >
                <span className="font-mono">
                  Point {index + 1}: {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                </span>
                {editable && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      const updated = points.filter((_, i) => i !== index);
                      setPoints(updated);
                      onChange?.(updated);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Instructions */}
      {editable && points.length === 0 && (
        <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm text-blue-900 font-medium">How to use:</p>
          <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
            <li>Click "Start Drawing" to enable drawing mode and click on the map, OR</li>
            <li>Click "Add Current Location" to use your GPS position (walk to each corner)</li>
            <li>Add at least 3 points to form a polygon</li>
            <li>Drag markers to adjust positions if needed</li>
            <li>Use "Undo Last" or "Clear All" to remove points</li>
          </ol>
          <p className="text-xs text-blue-700 mt-2 italic">
            💡 Tip: Walk around the perimeter and click "Add Current Location" at each corner for accurate field mapping
          </p>
        </div>
      )}
    </div>
  );
};

export default PolygonMap;
