// Definimos o formato dos dados que esperamos receber da nossa API
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

// Função para buscar os dados no Spring Boot
async function getProducts() {
  // Atualiza para o novo endpoint da porta 8080
  const res = await fetch('http://localhost:8080/api/produtos', {
    method: 'GET',
    headers: {
      'X-Tenant-Slug': 'minha-super-loja',
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Falha ao buscar produtos');
  }

  return res.json();
}

export default async function Home() {
  // Executa a busca antes de renderizar a página
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho da Loja */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Minha Super Loja</h1>
          <p className="text-gray-500 mt-2">Os melhores produtos do mercado.</p>
        </header>

        {/* Vitrine de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed min-h-[40px]">
                {product.description}
              </p>
              
              <div className="mt-6 flex items-center justify-between">
                <span className="text-blue-600 font-bold text-2xl">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
              
              <button className="mt-5 w-full bg-blue-600 text-white font-medium py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all">
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}