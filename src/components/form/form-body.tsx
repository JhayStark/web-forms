import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "../ui/form";
import InputFormField from "../form-fields/input";
import { Button } from "../ui/button";
import SelectFormField from "../form-fields/select";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  console.log(form.watch());

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="space-y-4"
      >
        <InputFormField
          control={form.control}
          name="username"
          label="Username"
          placeholder="Enter your username"
          description="This is your public display name"
        />
        <InputFormField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
        <SelectFormField
          control={form.control}
          name="role"
          label="Role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
            { value: "guest", label: "Guest" },
          ]}
        />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default MyForm;
