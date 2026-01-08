import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signUpSchema = z.object({
  firstname: z.string().min(1, "Tên bắt buộc phải có"),
  lastname: z.string().min(1, "Họ bắt buộc phải có"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export function SignupForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { firstname, lastname, username, email, password } = data;

    await signUp(username, password, email, firstname, lastname);
    navigate("/signin");
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-6xl", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 w-full">
          <form
            className="p-8 md:p-10 flex flex-col justify-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div className="flex flex-col gap-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                  Create your account
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email below to create your account
                </p>
              </div>

              {/* Họ + Tên */}
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel htmlFor="lastName">Họ</FieldLabel>
                    <Input id="lastName" {...register("lastname")} />
                    {errors.lastname && (
                      <p className="text-destructive text-sm">
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FieldLabel htmlFor="firstName">Tên</FieldLabel>
                    <Input id="firstName" {...register("firstname")} />
                    {errors.firstname && (
                      <p className="text-destructive text-sm">
                        {errors.firstname.message}
                      </p>
                    )}
                  </div>
                </div>
              </Field>

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="thiennguyen"
                />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
                <FieldDescription>
                  Chúng tôi sẽ liên hệ với bạn qua email này.
                </FieldDescription>
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Button
                type="submit"
                className="w-full !bg-black !text-white hover:!bg-gray-900"
                disabled={isSubmitting}
              >
                Tạo tài khoản
              </Button>

              <FieldSeparator>Or continue with</FieldSeparator>

              {/* Social buttons giữ nguyên */}
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/signup.avif"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </FieldDescription>
    </div>
  );
}
