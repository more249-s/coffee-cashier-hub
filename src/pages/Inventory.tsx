import { AlertCircle, CheckCircle, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Inventory() {
  const inventory = [
    { name: "بن برازيلي", quantity: 45, unit: "كجم", min: 20, status: "كافٍ" },
    { name: "بن تركي", quantity: 12, unit: "كجم", min: 15, status: "منخفض" },
    { name: "حليب", quantity: 80, unit: "لتر", min: 30, status: "كافٍ" },
    { name: "سكر", quantity: 25, unit: "كجم", min: 10, status: "كافٍ" },
    { name: "أكواب ورقية صغيرة", quantity: 150, unit: "قطعة", min: 200, status: "منخفض" },
    { name: "أكواب ورقية كبيرة", quantity: 320, unit: "قطعة", min: 150, status: "كافٍ" },
    { name: "شاي", quantity: 8, unit: "كجم", min: 10, status: "منخفض" },
    { name: "نعناع", quantity: 5, unit: "كجم", min: 3, status: "كافٍ" },
  ];

  const lowStock = inventory.filter((item) => item.quantity < item.min);
  const adequateStock = inventory.filter((item) => item.quantity >= item.min);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">المخزون</h1>
        <p className="text-muted-foreground">متابعة مستويات المخزون والتنبيهات</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الأصناف</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">أصناف منخفضة</p>
                <p className="text-2xl font-bold text-warning">{lowStock.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">أصناف كافية</p>
                <p className="text-2xl font-bold text-success">{adequateStock.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              تنبيه: أصناف منخفضة تحتاج إعادة طلب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {lowStock.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-warning/20 bg-background"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      الحد الأدنى: {item.min} {item.unit}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-warning">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>جميع الأصناف</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item, index) => {
              const percentage = (item.quantity / (item.min * 2)) * 100;
              const isLow = item.quantity < item.min;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium text-lg">{item.name}</p>
                      <Badge variant={isLow ? "destructive" : "default"} className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          الكمية: {item.quantity} {item.unit}
                        </span>
                        <span className="text-muted-foreground">
                          الحد الأدنى: {item.min} {item.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isLow ? "bg-warning" : "bg-success"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
