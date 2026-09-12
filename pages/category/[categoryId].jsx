import { useRouter } from 'next/router';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Esta função é executada no servidor a cada requisição
export async function getServerSideProps(context) {
  const { params } = context;

  if (!params?.categoryId) {
    return { notFound: true };
  }

  const response = await fetch(`${API_URL}/api/categories/${params.categoryId}`, {
    headers: {
      'x-api-key': process.env.APP_API_KEY,
    },
  });

  const category = await response.json();

  // Aqui, a categoria traz uma lista de CategoryOnProduct
  // então, precisamos buscar os detalhes do produto para cada productId
  const productPromises = category.products.map(product =>
    fetch(`${API_URL}/api/products/${product.productId}`, {
      headers: {
        'x-api-key': process.env.APP_API_KEY,
      },
    }).then(response => response.json())
  );

  // Usamos Promise.all para esperar todas as chamadas de produto terminarem
  const products = await Promise.all(productPromises);

  return {
    props: { category, products },
  };
};

const CategoryPage = ({ category, products }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Produtos da Categoria {category.name}</h1>
      {console.log(products)}
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          {/* Inclua mais detalhes do produto conforme necessário */}
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
