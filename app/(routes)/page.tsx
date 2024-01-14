import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

export const revalidation = 0;

const HomePage = async () => {
  const products = await getProducts({ isFeatured: true });
  const billboard = await getBillboard("64545c9d-588e-453b-bfcd-b7d0d507cf3d");

  return (
    <Container>
      <div className=" space-y-10 pb-10">
        <Billboard data={billboard} />
        <div className=" flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Product" items={products} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;