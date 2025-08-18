import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Tag } from 'lucide-react';

export default function Checkout() {
  const { id } = useParams();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    nif: '',
    endereco: '',
    cidade: '',
    codigoPostal: '',
    pais: 'Portugal'
  });

  // Mock product data
  const product = {
    id: 1,
    title: 'Marketing Digital Completo 2025',
    price: 149,
    originalPrice: 299,
    image: 'https://images.pexels.com/photos/7414294/pexels-photo-7414294.jpeg?auto=compress&cs=tinysrgb&w=300'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toLowerCase() === 'desconto10') {
      setAppliedCoupon({
        code: couponCode,
        discount: 10,
        type: 'percentage'
      });
    }
  };

  const calculateTotal = () => {
    let total = product.price;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        total = total * (1 - appliedCoupon.discount / 100);
      } else {
        total = total - appliedCoupon.discount;
      }
    }
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout submission
    console.log('Checkout submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/produto/${id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao produto
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações de faturação</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o seu email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-2">
                  NIF (opcional)
                </label>
                <input
                  type="text"
                  id="nif"
                  name="nif"
                  value={formData.nif}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o seu NIF"
                />
              </div>

              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  required
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o seu endereço"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    required
                    value={formData.cidade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cidade"
                  />
                </div>

                <div>
                  <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    required
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0000-000"
                  />
                </div>

                <div>
                  <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-2">
                    País *
                  </label>
                  <select
                    id="pais"
                    name="pais"
                    required
                    value={formData.pais}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Portugal">Portugal</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Espanha">Espanha</option>
                    <option value="França">França</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de pagamento</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment" value="card" defaultChecked className="mr-3" />
                    <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                    <span>Cartão de crédito/débito</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment" value="paypal" className="mr-3" />
                    <div className="w-5 h-5 mr-3 bg-blue-600 rounded"></div>
                    <span>PayPal</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Lock className="w-5 h-5 mr-2" />
                Finalizar compra - €{calculateTotal().toFixed(2)}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Product Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do pedido</h3>
              
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.title}</h4>
                  <p className="text-sm text-gray-600">Curso online</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">€{product.price}</div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-400 line-through">€{product.originalPrice}</div>
                  )}
                </div>
              </div>

              {/* Coupon */}
              <div className="border-t pt-4 mb-4">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Código de desconto"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 text-sm text-green-600">
                    Cupão "{appliedCoupon.code}" aplicado! Desconto de {appliedCoupon.discount}%
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{product.price.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>-€{(product.price - calculateTotal()).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>IVA (23%)</span>
                  <span>€{(calculateTotal() * 0.23).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>€{(calculateTotal() * 1.23).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-green-600 mr-2" />
                <div className="text-sm text-green-800">
                  <div className="font-medium">Pagamento seguro</div>
                  <div>Os seus dados estão protegidos com encriptação SSL</div>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">Garantia de 30 dias</div>
                <div>Se não ficar satisfeito, devolvemos o seu dinheiro</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}