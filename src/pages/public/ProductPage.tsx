import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Users, Clock, Play, Download, ShoppingCart, Heart } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();

  // Mock product data - will be replaced with real data from database
  const product = {
    id: 1,
    title: 'Marketing Digital Completo 2025',
    description: 'Curso completo de marketing digital com foco em resultados práticos e estratégias atualizadas para o mercado atual.',
    longDescription: 'Este curso foi desenvolvido para profissionais que desejam dominar as principais estratégias de marketing digital. Aprenderá desde os conceitos básicos até técnicas avançadas de SEO, Google Ads, Facebook Ads, email marketing e muito mais.',
    price: '€149',
    originalPrice: '€299',
    category: 'cursos',
    rating: 4.9,
    students: 2847,
    duration: '40h',
    modules: 12,
    videos: 85,
    image: 'https://images.pexels.com/photos/7414294/pexels-photo-7414294.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: {
      name: 'Ana Silva',
      bio: 'Especialista em Marketing Digital com mais de 10 anos de experiência',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    features: [
      'Acesso vitalício ao curso',
      'Certificado de conclusão',
      'Suporte direto com o instrutor',
      'Materiais para download',
      'Atualizações gratuitas'
    ],
    curriculum: [
      {
        title: 'Introdução ao Marketing Digital',
        lessons: 8,
        duration: '2h 30min'
      },
      {
        title: 'SEO e Otimização para Motores de Busca',
        lessons: 12,
        duration: '4h 15min'
      },
      {
        title: 'Google Ads e Publicidade Paga',
        lessons: 10,
        duration: '3h 45min'
      },
      {
        title: 'Redes Sociais e Facebook Ads',
        lessons: 15,
        duration: '5h 20min'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {product.description}
              </p>

              {/* Stats */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                  <span className="ml-1 text-gray-500">({product.students} avaliações)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-1" />
                  <span>{product.students} alunos</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>{product.duration}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center mb-8">
                <img 
                  src={product.instructor.avatar} 
                  alt={product.instructor.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-medium text-gray-900">{product.instructor.name}</div>
                  <div className="text-sm text-gray-600">{product.instructor.bio}</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">O que está incluído:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-4 transition-colors">
                      <Play className="w-8 h-8" />
                    </button>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-blue-600">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Poupe {parseInt(product.originalPrice?.replace('€', '') || '0') - parseInt(product.price.replace('€', ''))}€
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    to={`/checkout/${product.id}`}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Comprar agora
                  </Link>
                  
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Adicionar à lista de desejos
                  </button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  Garantia de 30 dias ou o seu dinheiro de volta
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre este curso</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.longDescription}
              </p>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Conteúdo do curso</h2>
              <div className="space-y-4">
                {product.curriculum.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{module.title}</h3>
                        <div className="text-sm text-gray-600">
                          {module.lessons} aulas • {module.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Detalhes do curso</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração total</span>
                  <span className="font-medium">{product.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Módulos</span>
                  <span className="font-medium">{product.modules}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vídeos</span>
                  <span className="font-medium">{product.videos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nível</span>
                  <span className="font-medium">Iniciante a Avançado</span>
                </div>
              </div>
            </div>

            {/* Related Courses */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cursos relacionados</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <img 
                    src="https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=100" 
                    alt="Curso relacionado"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">Desenvolvimento Web</h4>
                    <p className="text-xs text-gray-600">€249</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}