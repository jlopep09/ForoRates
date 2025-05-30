import React from 'react'

export const ShopCatalog = () => {
  return (
    <section>
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold mb-4">Catálogo de la tienda</h2>
            <div className="bg-stone-300 text-black p-6 rounded-lg shadow-md w-full max-w-3xl">
                <p className="text-md mb-2">Disfruta de estas ventajas gastando los puntos obtenidos.</p>
                <p className="text-xl font-semibold">¡Pronto más novedades!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <ShopItem
                        name="Destaca tus hilos"
                        description="Las portadas de tus hilos serán más visibles y atractivas durante 24h."
                        price={50}
                        image={"shop-item-1.webp"}
                    />
                    <ShopItem
                        name="Doble de puntos"
                        description="Obtén el doble de puntos durante 24h."
                        price={30}
                        image={"shop-item-2.webp"}
                    />
                </div>
                <p className="text-md mt-2">Recuerda que para ganar puntos solo tendrás que participar en hilos de otros usuarios.</p>
            </div>
        </div>

    </section>
  )
}


function ShopItem({name, description, price, image}) {
  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-md p-4  w-full max-w-sm">
      <img src={image} alt={name} className="w-full h-32 object-contain rounded-t-lg" />
      <h3 className="text-xl font-semibold mt-2">{name}</h3>
      <p className="text-gray-600">{description}</p>
      <p className="text-lg font-bold mt-2">Precio: {price} puntos</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600">Comprar</button>
    </div>
  )
}

