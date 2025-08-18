import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  BookOpen, 
  Users, 
  Euro, 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit, 
  BarChart3,
  Download,
  Settings,
  Bell
} from 'lucide-react';

interface DashboardStats {
  totalProdutos: number;
  totalVendas: number;
  receitaTotal: number;
  alunosAtivos: number;
}

interface Produto {
  id: string;
  titulo: string;
  tipo_produto: string;
  preco: number;
  ativo: boolean;
  total_vendas: number;
  data_criacao: string;
}

export default function ProducerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProdutos: 0,
    totalVendas: 0,
    receitaTotal: 0,
    alunosAtivos: 0
  });
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  const carregarDados = async () => {
    try {
      // Carregar produtos do produtor
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select('*')
        .eq('produtor_id', user?.id)
        .order('data_criacao', { ascending: false });

      if (produtosError) {
        console.error('Erro ao carregar produtos:', produtosError);
      } else if (produtosData) {
        setProdutos(produtosData);
        
        // Calcular estatísticas
        const totalProdutos = produtosData.length;
        const totalVendas = produtosData.reduce((sum, produto) => sum + (produto.total_vendas || 0), 0);
        const receitaTotal = produtosData.reduce((sum, produto) => sum + (produto.preco * (produto.total_vendas || 0)), 0);
        
        setStats({
          totalProdutos,
          totalVendas,
          receitaTotal,
          alunosAtivos: totalVendas // Simplificado para o exemplo
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Produtor</h1>
              <p className="text-gray-600">Bem-vindo de volta, {user?.nome}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <Link
                to="/produtor/produto/novo"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProdutos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVendas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Euro className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.receitaTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alunos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.alunosAtivos}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produtos Recentes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Os Meus Produtos</h2>
                  <Link
                    to="/produtor/produtos"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {produtos.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto criado</h3>
                    <p className="text-gray-600 mb-4">Comece a criar o seu primeiro produto digital</p>
                    <Link
                      to="/produtor/produto/novo"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Produto
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {produtos.slice(0, 5).map((produto) => (
                      <div key={produto.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{produto.titulo}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600 capitalize">{produto.tipo_produto}</span>
                            <span className="text-sm font-medium text-green-600">€{produto.preco}</span>
                            <span className="text-sm text-gray-600">{produto.total_vendas || 0} vendas</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            produto.ativo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {produto.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <Link
                  to="/produtor/produto/novo"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 mr-3 text-blue-600" />
                  Criar Novo Produto
                </Link>
                <Link
                  to="/produtor/cursos"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-3 text-green-600" />
                  Gerir Cursos
                </Link>
                <Link
                  to="/produtor/vendas"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 mr-3 text-purple-600" />
                  Relatórios de Vendas
                </Link>
                <Link
                  to="/produtor/levantamentos"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Euro className="w-5 h-5 mr-3 text-yellow-600" />
                  Solicitar Levantamento
                </Link>
              </div>
            </div>

            {/* Vendas Recentes */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendas Recentes</h2>
              <div className="space-y-3">
                <div className="text-center py-4 text-gray-500">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Nenhuma venda recente</p>
                </div>
              </div>
            </div>

            {/* Suporte */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Consulte o nosso centro de ajuda ou contacte o suporte.
              </p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                Centro de Ajuda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}