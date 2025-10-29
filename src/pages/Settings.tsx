import { Shield, DollarSign, Bell, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات المحل والمستخدمين</p>
      </div>

      {/* User Role Card */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              معلومات المستخدم
            </div>
            <Badge className="bg-primary">مالك</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">اسم المستخدم</p>
                <p className="text-sm text-muted-foreground">أحمد محمد</p>
              </div>
              <Button variant="outline">تعديل</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">البريد الإلكتروني</p>
                <p className="text-sm text-muted-foreground">ahmed@example.com</p>
              </div>
              <Button variant="outline">تعديل</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Management (Owner Only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            إدارة الأسعار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            يمكن للمالك فقط تعديل أسعار المنتجات
          </p>
          <div className="space-y-3">
            {[
              { name: "قهوة تركي", price: 15 },
              { name: "شاي بالنعناع", price: 10 },
              { name: "كابتشينو", price: 25 },
              { name: "لاتيه", price: 30 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{item.price} جنيه</span>
                  <Button size="sm" variant="outline">
                    تعديل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-warning" />
            إعدادات التنبيهات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium">تنبيهات المخزون المنخفض</p>
                <p className="text-sm text-muted-foreground">تلقي تنبيه عند انخفاض المخزون</p>
              </div>
              <Button variant="default">مفعّل</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium">ملخص المبيعات اليومي</p>
                <p className="text-sm text-muted-foreground">تلقي ملخص يومي للمبيعات</p>
              </div>
              <Button variant="default">مفعّل</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management (Owner Only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            إدارة الموظفين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            إضافة وإدارة حسابات الموظفين
          </p>
          <div className="space-y-3">
            {[
              { name: "محمد علي", role: "موظف", status: "نشط" },
              { name: "فاطمة أحمد", role: "موظف", status: "نشط" },
            ].map((employee, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{employee.status}</Badge>
                  <Button size="sm" variant="outline">
                    إدارة
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4">إضافة موظف جديد</Button>
        </CardContent>
      </Card>
    </div>
  );
}
