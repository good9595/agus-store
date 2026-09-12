import { PrismaClient } from "@prisma/client";
import { withApiKey } from '../../../utils/withApiKey'

const prisma = new PrismaClient();

async function handle(req, res) {
  if (req.method === "GET") {
    const products = await prisma.product.findMany({
      include: { categories: true },  // Incluir categorias dos produtos
    });

    return res.status(200).json(products);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withApiKey(handle);