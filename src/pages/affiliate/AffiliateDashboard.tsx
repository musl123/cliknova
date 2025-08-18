import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Euro, 
  TrendingUp, 
  Link as LinkIcon, 
  Copy,
  Eye,
  BarChart3,
  Calendar,
  Settings,
  Bell,
  LogOut,
  Search,
  Filter,
  Download,
  Share2,
  Target,
  Award
} from 'lucide-react';

interface AfiliadoStats {
  totalVendas: number;
  comissoesTotais: number;
  comissoesPendentes: number;
  cliquesTotal: number;
  taxaConversao: number;
}

interface VendaAfiliado {
  id: string;
  produto_titulo: string;
  valor_venda: number;
  valor_comissao: number;
  percentual_comissao: number;
  status: string;
  data_venda: string;
}

interface LinkAfiliado {
  id: string;
  produto_id: string;
  produto_titulo: string;
  link_afiliado: string;
  cliques: number;
  vendas: number;
  comissao_total: number;
}

export default function AffiliateDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<AfiliadoStats>({
    totalVendas: 0,
    comissoesTotais: 0,
    comissoesPendentes: 0,
    cliquesTotal: 0,
    taxaConversao: 0
  });
  const [vendas, setVendas] = useState<VendaAfiliado[]>([]);
  const [links, setLinks] = useState<LinkAfiliado[]>([]);
  const [afiliadoData, setAfiliadoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  const carregarDados = async () => {
    try {
      // Carregar dados do afiliado
      const { data: afiliadoInfo, error: afiliadoError } = await supabase
        .from('afiliados')
        .select('*')
        .eq('utilizador_id', user?.id)
        .maybeSingle();

      if (afiliadoError) {
        console.error('Erro ao carregar dados do afiliado:', afiliadoError);
      } else if (afiliadoInfo) {
        setAfiliadoData(afiliadoInfo);

        // Carregar vendas do afiliado
        const { data: vendasData, error: vendasError } = await supabase
          .from('vendas_afiliados')
          .select(`
            *,
            produto:produtos(titulo)
          `)
          .eq('afiliado_id', afiliadoInfo.id)
          .order('data_venda', { ascending: false });

        if (vendasError) {
          console.error('Erro ao carregar vendas:', vendasError);
        } else if (vendasData) {
          const vendasFormatadas = vendasData.map(venda => ({
            id: venda.id,
            produto_titulo: venda.produto?.titulo || 'Produto não encontrado',
            valor_venda: venda.valor_venda,
            valor_comissao: venda.valor_comissao,
            percentual_comissao: venda.percentual_comissao,
            status: venda.status,
            data_venda: venda.data_venda
          }));

          setVendas(vendasFormatadas);

          // Calcular estatísticas
          const totalVendas = vendasFormatadas.length;
          const comissoesTotais = vendasFormatadas
            .filter(v => v.status === 'paga')
            .reduce((sum, v) => sum + v.valor_comissao, 0);
          const comissoesPendentes = vendasFormatadas
            .filter(v => v.status === 'pendente' || v.status === 'aprovada')
            .reduce((sum, v) => sum + v.valor_comissao, 0);

          setStats({
            totalVendas,
            comissoesTotais,
            comissoesPendentes,
            cliquesTotal: Math.floor(Math.random() * 1000) + 500, // Simulado
            taxaConversao: totalVendas > 0 ? (totalVendas / 100) * 100 : 0 // Simulado
          });
        }

        // Simular links de afiliado (em produção viria de uma tabela específica)
        const linksSimulados: LinkAfiliado[] = [
          {
            id: '1',
            produto_id: '1',
            produto_titulo: 'Marketing Digital Completo 2025',
            link_afiliado: `https://clikenova.com/produto/1?ref=${afiliadoInfo.codigo_referido}`,
            cliques: 245,
            vendas: 12,
            comissao_total: 178.80
          },
          {
            id: '2',
            produto_id: '2',
            produto_titulo: 'Curso de Programação Web',
            link_afiliado: `https://clikenova.com/produto/2?ref=${afiliadoInfo.codigo_referido}`,
            cliques: 189,
            vendas: 8,
            comissao_total: 119.20
          }
        ];

        setLinks(linksSimulados);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const copiarLink = (link: string) => {
    navigator.clipboard.writeText(link);
    // Aqui poderia adicionar uma notificação de sucesso
  };

  const gerarNovoLink = (produtoId: string) => {
    if (afiliadoData) {
      return `https://clikenova.com/produto/${produtoId}?ref=${afiliadoData.codigo_referido}`;
    }
    return '';
  };

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch = venda.produto_titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || venda.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!afiliadoData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Conta de afiliado não encontrada</h2>
          <p className="text-gray-600">Contacte o suporte para ativar a sua conta de afiliado.</p>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Afiliado</h1>
              <p className="text-gray-600">Bem-vindo de volta, {user?.nome}!</p>
              <p className="text-sm text-blue-600 font-medium">Código: {afiliadoData.codigo_referido}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  1
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
              <button 
                onClick={logout}
                className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVendas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Comissões Pagas</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.comissoesTotais.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Euro className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.comissoesPendentes.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cliques</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cliquesTotal}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{stats.taxaConversao.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Links de Afiliado */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Os Meus Links de Afiliado</h2>
              </div>
              <div className="p-6">
                {links.length === 0 ? (
                  <div className="text-center py-8">
                    <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum link criado</h3>
                    <p className="text-gray-600 mb-4">Comece a promover produtos e ganhe comissões</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {links.map((link) => (
                      <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{link.produto_titulo}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                <span>{link.cliques} cliques</span>
                              </div>
                              <div className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>{link.vendas} vendas</span>
                              </div>
                              <div className="flex items-center">
                                <Euro className="w-4 h-4 mr-1" />
                                <span>€{link.comissao_total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <code className="text-sm text-gray-700 flex-1 mr-2 break-all">
                              {link.link_afiliado}
                            </code>
                            <button
                              onClick={() => copiarLink(link.link_afiliado)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copiar
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center">
                            <Share2 className="w-4 h-4 mr-2" />
                            Partilhar
                          </button>
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Estatísticas
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Histórico de Vendas */}
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Histórico de Vendas</h2>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="todos">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="aprovada">Aprovada</option>
                    <option value="paga">Paga</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                {filteredVendas.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma venda encontrada</h3>
                    <p className="text-gray-600">Comece a promover produtos para ver as suas vendas aqui.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Produto</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Valor Venda</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Comissão</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVendas.map((venda) => (
                          <tr key={venda.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{venda.produto_titulo}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">€{venda.valor_venda.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-green-600">€{venda.valor_comissao.toFixed(2)}</div>
                              <div className="text-sm text-gray-500">{venda.percentual_comissao}%</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                venda.status === 'paga' 
                                  ? 'bg-green-100 text-green-800'
                                  : venda.status === 'aprovada'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {venda.status === 'paga' ? 'Paga' : venda.status === 'aprovada' ? 'Aprovada' : 'Pendente'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(venda.data_venda).toLocaleDateString('pt-PT')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ações Rápidas */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <Link
                  to="/afiliado/links"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LinkIcon className="w-5 h-5 mr-3 text-blue-600" />
                  Gerir Links
                </Link>
                <Link
                  to="/afiliado/materiais"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 mr-3 text-green-600" />
                  Materiais de Marketing
                </Link>
                <Link
                  to="/afiliado/relatorios"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 mr-3 text-purple-600" />
                  Relatórios Detalhados
                </Link>
                <Link
                  to="/afiliado/levantamentos"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Euro className="w-5 h-5 mr-3 text-yellow-600" />
                  Solicitar Levantamento
                </Link>
              </div>
            </div>

            {/* Próximo Pagamento */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximo Pagamento</h2>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">€{stats.comissoesPendentes.toFixed(2)}</div>
                <div className="text-sm text-gray-600 mb-4">Disponível para levantamento</div>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Solicitar Levantamento
                </button>
              </div>
            </div>

            {/* Performance do Mês */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance do Mês</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendas</span>
                  <span className="font-medium">{stats.totalVendas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliques</span>
                  <span className="font-medium">{stats.cliquesTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversão</span>
                  <span className="font-medium">{stats.taxaConversao.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Comissões</span>
                  <span className="font-medium text-green-600">€{stats.comissoesTotais.toFixed(2)}</span>
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