-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('owner', 'employee');

-- Create enum for product categories
CREATE TYPE public.product_category AS ENUM ('hot_drinks', 'cold_drinks', 'food', 'desserts', 'supplies');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table (CRITICAL for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category product_category NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create sales table
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  employee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on sales
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  employee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER NOT NULL DEFAULT 10,
  last_updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Enable RLS on inventory
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'owner'));

-- RLS Policies for products
CREATE POLICY "Everyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE OR public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Only owners can manage products"
  ON public.products FOR ALL
  USING (public.has_role(auth.uid(), 'owner'));

-- RLS Policies for sales
CREATE POLICY "Employees can view all sales"
  ON public.sales FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Employees can create sales"
  ON public.sales FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Owners can manage all sales"
  ON public.sales FOR ALL
  USING (public.has_role(auth.uid(), 'owner'));

-- RLS Policies for expenses
CREATE POLICY "Employees can view all expenses"
  ON public.expenses FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Employees can create expenses"
  ON public.expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Owners can manage all expenses"
  ON public.expenses FOR ALL
  USING (public.has_role(auth.uid(), 'owner'));

-- RLS Policies for inventory
CREATE POLICY "Employees can view inventory"
  ON public.inventory FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Employees can update inventory"
  ON public.inventory FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (auth.uid() = last_updated_by);

CREATE POLICY "Owners can manage inventory"
  ON public.inventory FOR ALL
  USING (public.has_role(auth.uid(), 'owner'));

-- Insert default products (أكل ومشروبات)
INSERT INTO public.products (name, category, price, cost, description) VALUES
-- Hot drinks
('قهوة تركي', 'hot_drinks', 15.00, 5.00, 'قهوة تركية أصلية'),
('شاي بالنعناع', 'hot_drinks', 10.00, 3.00, 'شاي أحمر مع نعناع طازج'),
('كابتشينو', 'hot_drinks', 25.00, 8.00, 'كابتشينو إيطالي'),
('لاتيه', 'hot_drinks', 30.00, 10.00, 'لاتيه بالحليب'),
('إسبريسو', 'hot_drinks', 20.00, 7.00, 'إسبريسو مركز'),
('موكا', 'hot_drinks', 35.00, 12.00, 'موكا بالشوكولاتة'),
('قهوة أمريكية', 'hot_drinks', 18.00, 6.00, 'قهوة أمريكية خفيفة'),
('شاي أخضر', 'hot_drinks', 12.00, 4.00, 'شاي أخضر صحي'),
-- Cold drinks
('عصير برتقال', 'cold_drinks', 20.00, 8.00, 'عصير برتقال طازج'),
('عصير مانجو', 'cold_drinks', 25.00, 10.00, 'عصير مانجو طبيعي'),
('ليموناضة', 'cold_drinks', 15.00, 5.00, 'ليموناضة منعشة'),
('آيس كوفي', 'cold_drinks', 30.00, 12.00, 'قهوة باردة'),
('موهيتو', 'cold_drinks', 28.00, 10.00, 'موهيتو بالنعناع'),
('ميلك شيك فانيليا', 'cold_drinks', 35.00, 15.00, 'ميلك شيك بالفانيليا'),
('ميلك شيك شوكولاتة', 'cold_drinks', 35.00, 15.00, 'ميلك شيك بالشوكولاتة'),
('سموثي فراولة', 'cold_drinks', 32.00, 13.00, 'سموثي فراولة طبيعي'),
-- Food
('ساندوتش جبنة', 'food', 25.00, 10.00, 'ساندوتش جبنة طازج'),
('ساندوتش تونة', 'food', 35.00, 15.00, 'ساندوتش تونة'),
('كرواسون', 'food', 20.00, 8.00, 'كرواسون فرنسي'),
('بيتزا صغيرة', 'food', 45.00, 20.00, 'بيتزا مارجريتا'),
('فطيرة بالجبنة', 'food', 18.00, 7.00, 'فطيرة بالجبنة'),
('برجر دجاج', 'food', 50.00, 22.00, 'برجر دجاج مشوي'),
-- Desserts
('كوكيز', 'desserts', 12.00, 5.00, 'كوكيز بالشوكولاتة'),
('براوني', 'desserts', 25.00, 10.00, 'براوني بالشوكولاتة'),
('تشيز كيك', 'desserts', 35.00, 15.00, 'تشيز كيك نيويورك'),
('دونات', 'desserts', 15.00, 6.00, 'دونات محلى'),
('آيس كريم', 'desserts', 20.00, 8.00, 'آيس كريم بنكهات مختلفة'),
('كنافة', 'desserts', 30.00, 12.00, 'كنافة بالقشطة'),
-- Supplies (for expenses)
('بن', 'supplies', 0, 200.00, 'كيلو بن'),
('حليب', 'supplies', 0, 50.00, 'لتر حليب'),
('سكر', 'supplies', 0, 30.00, 'كيلو سكر'),
('أكواب ورقية', 'supplies', 0, 100.00, 'علبة أكواب');

-- Insert default inventory for products
INSERT INTO public.inventory (product_id, quantity, min_quantity)
SELECT id, 50, 10 FROM public.products WHERE category != 'supplies';

-- Insert supplies with lower quantities
INSERT INTO public.inventory (product_id, quantity, min_quantity)
SELECT id, 5, 3 FROM public.products WHERE category = 'supplies';