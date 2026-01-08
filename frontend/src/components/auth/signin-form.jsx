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

const signInSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export function SigninForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { username, password } = data;
    await signIn(username, password);
    navigate("/");
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
                  Chào mừng quay lại
                </h1>
                <p className="text-muted-foreground text-sm">
                  Đăng nhập vào tài khoản của bạn
                </p>
              </div>

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
                Đăng nhập
              </Button>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-muted">
                Or continue with
              </FieldSeparator>

              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <span className="sr-only">Sign in with Apple</span>
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <span className="sr-only">Sign in with Google</span>
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <span className="sr-only">Sign in with Meta</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                Bạn chưa có tài khoản?{" "}
                <a
                  href="/signup"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Đăng ký
                </a>
              </div>
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
