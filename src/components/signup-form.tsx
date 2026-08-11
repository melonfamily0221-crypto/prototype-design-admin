import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate signup
    navigate("/login")
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>创建账号</CardTitle>
        <CardDescription>
          请输入您的信息以注册新账号
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">姓名</FieldLabel>
              <Input id="name" type="text" placeholder="请输入您的姓名" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">账号</FieldLabel>
              <Input
                id="email"
                type="text"
                placeholder="请输入账号"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">密码</FieldLabel>
              <Input id="password" type="password" placeholder="请输入密码" required />
              <FieldDescription>
                密码长度必须至少为 8 个字符。
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                确认密码
              </FieldLabel>
              <Input id="confirm-password" type="password" placeholder="请再次输入密码" required />
            </Field>
            <FieldGroup>
              <Field className="flex flex-col gap-4">
                <Button type="submit" className="w-full">创建账号</Button>
                <Button variant="outline" type="button" className="w-full">
                  使用 Google 注册
                </Button>
                <FieldDescription className="px-6 text-center mt-2">
                  已有账号？ <Link to="/login" className="underline underline-offset-4 hover:text-primary">点击登录</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
