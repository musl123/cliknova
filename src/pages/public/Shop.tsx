import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Users, Clock } from 'lucide-react';

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('popularidade');

  const categories = [
    { id: 'todos', name: 'Todos os produtos' },
    { id: 'cursos', name: 'Cursos online' },
    { id: 'ebooks', name: 'E-books' },
    { id: 'digitais', name: 'Produtos digitais' },
    { id: 'fisicos', name: 'Produtos físicos' }
  ];

  const products = [
    {
      id: 1,
      title: 'Marketing Digital Completo 2025',
      description: 'Curso completo de marketing digital com foco em resultados práticos e estratégias atualizadas.',
      price: '€149',
      originalPrice: '€299',
      category: 'cursos',
      rating: 4.9,
      students: 2847,
      duration: '40h',
      image: 'https://images.pexels.com/photos/7414294/pexels-photo-7414294.jpeg?auto=compress&cs=tinysrgb&w=500',
      instructor: 'Ana Silva',
      bestseller: true
    },
    {
      id: 2,
      title: 'E-book: Finanças Pessoais Inteligentes',
      description: 'Guia prático para organizar suas finanças, eliminar dívidas e construir patrimônio.',
      price: '€39',
      originalPrice: '€59',
      category: 'ebooks',
      rating: 4.8,
      students: 1534,
      duration: '120 páginas',
      image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=500',
      instructor: 'João Santos'
    },
    {
      id: 3,
      title: 'Desenvolvimento Web Full Stack',
      description: 'Aprenda React, Node.js, MongoDB e todas as tecnologias necessárias para ser um desenvolvedor completo.',
      price: '€249',
      originalPrice: '€499',
      category: 'cursos',
      rating: 4.9,
      students: 3921,
      duration: '60h',
      image: 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=500',
      instructor: 'Pedro Costa',
      bestseller: true
    },
    {
      id: 4,
      title: 'Pack de Templates Premium',
      description: 'Coleção de mais de 100 templates profissionais para websites, apresentações e redes sociais.',
      price: '€79',
      originalPrice: '€149',
      category: 'digitais',
      rating: 4.7,
      students: 892,
      duration: '100+ templates',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=500',
      instructor: 'Maria Oliveira'
    },
    {
      id: 5,
      title: 'Curso de Fotografia Profissional',
      description: 'Do básico ao avançado: técnicas de composição, iluminação e edição para fotografia profissional.',
      price: '€189',
      originalPrice: '€299',
      category: 'cursos',
      rating: 4.8,
      students: 1678,
      duration: '35h',
      image: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=500',
      instructor: 'Ricardo Almeida'
    },
    {
      id: 6,
      title: 'E-book: Receitas Saudáveis',
      description: 'Mais de 50 receitas nutritivas e deliciosas para uma alimentação equilibrada.',
      price: '€19',
      originalPrice: '€39',
      category: 'ebooks',
      rating: 4.6,
      students: 2341,
      duration: '80 páginas',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
      instructor: 'Sofia Mendes'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'preco-asc':
        return parseFloat(a.price.replace('€', '')) - parseFloat(b.price.replace('€', ''));
      case 'preco-desc':
        return parseFloat(b.price.replace('€', '')) - parseFloat(a.price.replace('€', ''));
      case 'rating':
        return b.rating - a.rating;
      case 'popularidade':
      default:
        return b.students - a.students;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loja ClikeNOVA</h1>
          <p className="text-gray-600">Descubra cursos, e-books e produtos digitais para acelerar o seu crescimento.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="popularidade">Mais populares</option>
              <option value="rating">Melhor avaliados</option>
              <option value="preco-asc">Preço: menor para maior</option>
              <option value="preco-desc">Preço: maior para menor</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="aspect-video relative">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.bestseller && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    Bestseller
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1 line-clamp-2">{product.title}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{product.students}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{product.duration}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Por <span className="font-medium">{product.instructor}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-blue-600">{product.price}</div>
                    {product.originalPrice && (
                      <div className="text-lg text-gray-400 line-through">{product.originalPrice}</div>
                    )}
                  </div>
                  <Link 
                    to={`/produto/${product.id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600">Tente ajustar os seus filtros de pesquisa.</p>
          </div>
        )}
      </div>
    </div>
  );
}