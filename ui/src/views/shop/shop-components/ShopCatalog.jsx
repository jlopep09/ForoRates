import React, { useEffect, useState } from 'react';
import { ENDPOINTS } from '../../../../constants';
import { Paper } from '@mui/material';

export const ShopCatalog = ({ userData }) => {
  const [benefits, setBenefits] = useState([]);
  const [loadingBenefits, setLoadingBenefits] = useState(true);

  // Fetch beneficios del usuario al montar el componente
  useEffect(() => {
    const fetchBenefits = async () => {
      setLoadingBenefits(true);
      try {
        const response = await fetch(`${ENDPOINTS.BENEFITS}/${userData.id}`);
        if (!response.ok) {
          throw new Error('Error al obtener beneficios');
        }
        const data = await response.json();
        setBenefits(data);
      } catch (error) {
        console.error('Error fetch beneficios:', error);
        setBenefits([]);
      } finally {
        setLoadingBenefits(false);
      }
    };

    fetchBenefits();
  }, [userData.id]);

  // Función que hace el POST al endpoint /benefits
  const handleBuy = async (name, price) => {
    // Fecha/hora actual en ISO
    const now = new Date();
    const startDateISO = now.toISOString();

    // Fecha/hora + 24h en ISO
    const plus24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endDateISO = plus24h.toISOString();

    try {
      const response = await fetch(
        `${ENDPOINTS.BENEFITS}?user_id=${userData.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            price,
            start_date: startDateISO,
            end_date: endDateISO,
            user_id: userData.id,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`No se ha podido realizar la transacción: ${errorText}`);
      }

      const data = await response.json();
      alert('Compra realizada con éxito.');
      console.log('Respuesta del backend:', data);

      // Refrescar lista de beneficios para reflejar el nuevo/actualizado
      const refreshed = await fetch(`${ENDPOINTS.BENEFITS}/${userData.id}`);
      if (refreshed.ok) {
        const updatedList = await refreshed.json();
        setBenefits(updatedList);
      }
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      alert('Hubo un problema al realizar la compra. '+error);
    }
  };

  // Comprueba si un beneficio está activo (now entre start_date y end_date)
  const isBenefitActive = (benefitName) => {
    const now = new Date();
    return benefits.some((b) => {
      if (b.name !== benefitName) return false;
      const start = new Date(b.start_date);
      const end = new Date(b.end_date);
      return start <= now && now <= end;
    });
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center p-2">
        <h2 className="text-2xl font-bold mb-4">Catálogo de la tienda</h2>
        <Paper elevation={2} className="p-6 rounded-lg shadow-md w-full max-w-3xl pb-3">
          <p className="text-md mb-1">
            Disfruta de estas ventajas gastando los puntos obtenidos.
          </p>
          <p className="text-xl font-semibold">¡Pronto más novedades!</p>

          {/* Mostrar un texto de carga mientras obtenemos beneficios */}
          {loadingBenefits ? (
            <p className="mt-4 text-center">Cargando beneficios...</p>
          ) : (
            <Paper className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 justify-items-center sm:justify-items-stretch">
              <ShopItem
                name="Destaca tus hilos"
                description="Las portadas de tus hilos serán más visibles y atractivas durante 24h."
                price={50}
                image="shop-item-1.webp"
                onBuy={handleBuy}
                disabled={isBenefitActive('Destaca tus hilos')}
              />
              <ShopItem
                name="Doble de puntos"
                description="Obtén el doble de puntos durante 24h."
                price={30}
                image="shop-item-2.webp"
                onBuy={handleBuy}
                disabled={isBenefitActive('Doble de puntos')}
              />
            </Paper>
          )}

          <p className="text-md mt-2 text-neutral-400">
            Recuerda que para ganar puntos solo tendrás que participar en hilos de
            otros usuarios.
          </p>
        </Paper>
      </div>
    </section>
  );
};

function ShopItem({ name, description, price, image, onBuy, disabled }) {
  return (
    <Paper elevation={4} className="flex flex-col justify-between rounded-lg shadow-md p-4 w-full max-w-sm">
      <img
        src={image}
        alt={name}
        className="w-full h-28 object-contain rounded-t-lg"
      />
      <h3 className="text-lg font-semibold mt-1">{name}</h3>
      <p className=" text-sm text-neutral-400">{description}</p>
      <p className="text-md font-bold mt-2">Precio: {price} puntos</p>
      <button
        className={`px-8 py-1 rounded mt-2 text-black ${
          disabled
            ? 'bg-green-800 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={() => onBuy(name, price)}
        disabled={disabled}
      >
        {disabled ? 'Activo' : 'Comprar'}
      </button>
    </Paper>
  );
}
