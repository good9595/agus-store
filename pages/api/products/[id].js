import { PrismaClient } from "@prisma/client";
import { withApiKey } from '../../../utils/withApiKey'

const prisma = new PrismaClient();

async function handle(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {  categories: true  },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withApiKey(handle)