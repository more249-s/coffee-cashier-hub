import { useState, useEffect } from "react";
import { Coffee, CupSoda, Cookie, Croissant } from "lucide-react";
import { QuickActionButton } from "@/components/QuickActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  created_at: string;
  employee_id: string;
  products: { name: string };
  profiles: { full_name: string };
}

export default function Sales() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyTotal, setDailyTotal] = useState(0);

  useEffect(() => {
    fetchSales();
    fetchDailyTotal();
  }, []);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`*, products (name), profiles (full_name)`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في جلب المبيعات');
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyTotal = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('sales')
        .select('total_amount')
        .gte('created_at', today.toISOString());

      if (error) throw error;
      const total = data?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      setDailyTotal(total);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleQuickSale = async (productName: string, price: number) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('name', productName)
        .single();

      if (productError) throw productError;

      const { error: saleError } = await supabase
        .from('sales')
        .insert({
          product_id: product.id,
          quantity: 1,
          unit_price: price,
          total_amount: price,
          employee_id: user.id,
        });

      if (saleError) throw saleError;

      toast.success(`تم إضافة ${productName} بنجاح - ${price} جنيه`);
      fetchSales();
      fetchDailyTotal();
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في إضافة البيع');
    }
  };

  const quickItems = [
    { label: "شاي", icon: Coffee, price: 25 },
    { label: "قهوة تركي", icon: Coffee, price: 30 },
    { label: "كابتشينو", icon: CupSoda, price: 45 },
    { label: "كعك", icon: Cookie, price: 15 },
    { label: "كرواسون", icon: Croissant, price: 20 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2">المبيعات السريعة</h1>
        <p className="text-muted-foreground">إضافة مبيعات بضغطة واحدة</p>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>منتجات شائعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickItems.map((item) => (
              <QuickActionButton
                key={item.label}
                label={item.label}
                icon={item.icon}
                price={`${item.price}`}
                onClick={() => handleQuickSale(item.label, item.price)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 shadow-warm">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">إجمالي المبيعات اليوم</p>
            <p className="text-4xl font-bold text-primary">{dailyTotal.toFixed(2)} جنيه</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>آخر المبيعات</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">جاري التحميل...</p>
          ) : sales.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">لا توجد مبيعات بعد</p>
          ) : (
            <div className="space-y-3">
              {sales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-all hover-scale">
                  <div className="flex-1">
                    <p className="font-medium">{sale.products.name}</p>
                    <p className="text-sm text-muted-foreground">الكمية: {sale.quantity} × {sale.unit_price} جنيه</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      البائع: {sale.profiles.full_name} • {new Date(sale.created_at).toLocaleString('ar-EG')}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-primary">{sale.total_amount} جنيه</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
