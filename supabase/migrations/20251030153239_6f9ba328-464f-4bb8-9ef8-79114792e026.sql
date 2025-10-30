-- إصلاح نظام الأدوار وإضافة المستخدم الأول كمالك تلقائياً
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- حساب عدد المستخدمين الحاليين
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  
  -- إذا كان أول مستخدم، اجعله مالك (owner)
  -- وإلا اجعله موظف (employee)
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'owner');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'employee');
  END IF;
  
  RETURN NEW;
END;
$$;

-- إنشاء trigger لتشغيل الوظيفة عند إضافة مستخدم جديد
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- تحديث RLS policies للتأكد من الأمان
-- إعادة إنشاء سياسة الأمان لجدول products
DROP POLICY IF EXISTS "Everyone can view active products" ON public.products;
CREATE POLICY "Everyone can view active products" 
ON public.products FOR SELECT 
USING (is_active = true OR public.has_role(auth.uid(), 'owner'));

DROP POLICY IF EXISTS "Only owners can manage products" ON public.products;
CREATE POLICY "Only owners can manage products" 
ON public.products FOR ALL 
USING (public.has_role(auth.uid(), 'owner'));

-- تحديث سياسات sales لتتبع من قام بالبيع
DROP POLICY IF EXISTS "Employees can view all sales" ON public.sales;
CREATE POLICY "Employees can view all sales" 
ON public.sales FOR SELECT 
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Employees can create sales" ON public.sales;
CREATE POLICY "Employees can create sales" 
ON public.sales FOR INSERT 
WITH CHECK (auth.uid() = employee_id);

-- تحديث سياسات expenses لتتبع من قام بالمصروف
DROP POLICY IF EXISTS "Employees can view all expenses" ON public.expenses;
CREATE POLICY "Employees can view all expenses" 
ON public.expenses FOR SELECT 
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Employees can create expenses" ON public.expenses;
CREATE POLICY "Employees can create expenses" 
ON public.expenses FOR INSERT 
WITH CHECK (auth.uid() = employee_id);

-- إضافة سياسة للمخزون
DROP POLICY IF EXISTS "Employees can view inventory" ON public.inventory;
CREATE POLICY "Employees can view inventory" 
ON public.inventory FOR SELECT 
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Employees can update inventory" ON public.inventory;
CREATE POLICY "Employees can update inventory" 
ON public.inventory FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (last_updated_by = auth.uid());