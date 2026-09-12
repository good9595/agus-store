import { useRouter } from 'next/router';
import Image from 'next/image';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Esta função é executada no momento da construção
export async function getStaticPaths() {
  const response = await fetch(`${API_URL}/api/products`, {
    headers: {
      'x-api-key': process.env.APP_API_KEY,
    },
  });
  const products = await response.json();

  // Aqui, você pode especificar os produtos que deseja gerar primeiro
  const paths = products.slice(0, 10).map((product) => ({
    params: { productId: product.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
};

// Esta função é executada no servidor a cada requisição
export async function getStaticProps(context) {
  const { params } = context;
  
  if (!params?.productId) {
    return { notFound: true };
  }

  const response = await fetch(`${API_URL}/api/products/${params.productId}`, {
    headers: {
      'x-api-key': process.env.APP_API_KEY,
    },
  });

  // Adicione um delay artificial se a rota não foi pré-renderizada
  if (response.status === 404) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  const product = await response.json();

  return {
    props: { product },
    revalidate: 10, // Atualiza a página a cada 10 segundos
  };
};

const ProductPage = ({ product }) => {
  if (!product) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Detalhes do Produto {product.id}</h1>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p>{`R$ ${product.price.toFixed(2)}`}</p>
      <Image src={product.imageUrl} width={500} height={500} alt={product.title} />
    </div>
  );
};

export default ProductPage;
