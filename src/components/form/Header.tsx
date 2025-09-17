import { Calendar, History, User } from "lucide-react";

interface HeaderProps {
  title: string;
  description?: string;
  postedBy?: string;
  createdAt?: string;
  modifiedAt?: string;
  isMultiStep?: boolean;
}

const itemStyles = "flex items-center space-x-2 text-gray-500";

const Header = ({
  title,
  description,
  postedBy,
  createdAt,
  modifiedAt,
  isMultiStep = false,
}: HeaderProps) => {
  return (
    <div className="shadow-md rounded-t-lg border-t-8 bg-white p-6 border-primary space-y-4">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
      </div>
      <p className="border-b pb-4">{description}</p>
      <div className="flex-col flex md:flex-row md:items-center gap-3 md: gap-4 mt-2">
        {postedBy && (
          <div className={itemStyles}>
            <User />
            <p className="text-sm">
              Posted by:{" "}
              <span className="font-medium text-secondary">{postedBy}</span>
            </p>
          </div>
        )}
        {createdAt && (
          <div className={itemStyles}>
            <Calendar />
            <p className="text-sm">
              Created at:{" "}
              <span className="font-medium text-secondary">{createdAt}</span>
            </p>
          </div>
        )}
        {modifiedAt && (
          <div className={itemStyles}>
            <History />
            <p className="text-sm">
              Last modified:{" "}
              <span className="font-medium text-secondary">{modifiedAt}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
