import React from "react";
import {
    CreditCard, MapPin, Wallet, Plus, Home, GraduationCap,
    CarFront, BadgeCheck, ShieldCheck, FileText, TrendingUp, History, Trash2, Lock
} from "lucide-react";
import "./style/SubtelasPerfil.css";

// --- 1. INFORMAÇÕES PESSOAIS ---
export const TelaInfo = ({ onSave }) => (
    <div className="subtela-container">
        <h2 className="subtela-titulo">Informações Pessoais</h2>
        <p className="subtela-desc">Dados utilizados para sua identificação única no VEM CAR.</p>

        <div className="input-group-matte">
            <label className="label-solid">Nome Completo</label>
            <input className="input-solid" defaultValue="Carlos Eduardo" />
        </div>
        <div className="input-group-matte">
            <label className="label-solid">CPF (Identificador Único)</label>
            <input className="input-solid" defaultValue="000.000.000-00" disabled />
        </div>
        <div className="input-group-matte">
            <label className="label-solid">E-mail</label>
            <input className="input-solid" defaultValue="carlos.eduardo@ifrn.edu.br" />
        </div>

        <button className="btn-salvar-matte" onClick={onSave}>Salvar Alterações</button>
    </div>
);

// --- 2. PAGAMENTOS ---
export const TelaPagamentos = ({ onAddCartao }) => (
    <div className="subtela-container">
        <h2 className="subtela-titulo">Pagamentos</h2>
        <p className="subtela-desc">Gerencie seus métodos. O padrão atual é dinheiro físico.</p>

        <div className="card-item-salvo">
            <div className="icone-item-salvo"><Wallet size={24} color="#00E5FF" /></div>
            <div style={{ flex: 1 }}>
                <h3 className="titulo-item-salvo">Dinheiro (Padrão)</h3>
                <p className="desc-item-salvo">Lembre-se de informar o troco.</p>
            </div>
        </div>

        <button className="btn-adicionar-matte" onClick={onAddCartao}>
            <Plus size={20} color="#00E5FF" />
            <span>Vincular novo método</span>
        </button>
    </div>
);

// --- 3. ENDEREÇOS ---
export const TelaEnderecos = ({ onAddEndereco }) => (
    <div className="subtela-container">
        <h2 className="subtela-titulo">Endereços Salvos</h2>
        <p className="subtela-desc">Locais favoritos para agilizar suas chamadas.</p>

        <div className="card-item-salvo">
            <Home size={24} color="#FFF" />
            <div style={{ flex: 1 }}>
                <h3 className="titulo-item-salvo">Casa</h3>
                <p className="desc-item-salvo">R. Santo Antônio, 42 - Centro</p>
            </div>
        </div>

        <button className="btn-adicionar-matte" onClick={onAddEndereco}>
            <Plus size={20} color="#00E5FF" />
            <span>Adicionar local favorito</span>
        </button>
    </div>
);

// --- 4. SEGURANÇA ---
export const TelaSeguranca = ({ onSave }) => (
    <div className="subtela-container">
        <h2 className="subtela-titulo">Segurança</h2>
        <p className="subtela-desc">Gerencie sua senha criptografada e privacidade.</p>

        <div className="input-group-matte">
            <label className="label-solid">Senha Atual</label>
            <input className="input-solid" type="password" placeholder="••••••••" />
        </div>
        <div className="input-group-matte">
            <label className="label-solid">Nova Senha</label>
            <input className="input-solid" type="password" placeholder="Mínimo 6 caracteres" />
        </div>

        <button className="btn-salvar-matte" onClick={onSave}>Atualizar Senha</button>
    </div>
);

// --- 5. VEM IFRN (CARTEIRINHA VIRTUAL) ---
export const TelaVemIFRN = () => (
    <div className="subtela-container">
        <h2 className="subtela-titulo">VEM IFRN</h2>
        <p className="subtela-desc">Seu passe institucional para rotas com tarifas reduzidas.</p>

        <div className="carteirinha-virtual-matte">
            <div className="carteirinha-topo">
                <div className="carteirinha-logo">
                    <GraduationCap size={24} color="#FFF" />
                    <span>INSTITUTO FEDERAL</span>
                </div>
                <div className="carteirinha-selo">ATIVO</div>
            </div>

            <div className="carteirinha-corpo">
                <h3 className="carteirinha-nome">Carlos Eduardo</h3>
                <p className="carteirinha-curso">Tecnologia em Análise e Desenvolvimento de Sistemas</p>

                <div className="carteirinha-dados-grid">
                    <div className="carteirinha-dado">
                        <span>Campus</span>
                        <strong>Nova Cruz - RN</strong>
                    </div>
                    <div className="carteirinha-dado">
                        <span>Período</span>
                        <strong>5º Período</strong>
                    </div>
                </div>
            </div>

            <div className="carteirinha-rodape">
                <ShieldCheck size={18} color="#000" strokeWidth={2.5} />
                <span>Credencial vinculada ao VEM CAR</span>
            </div>
        </div>
    </div>
);

// --- 6. VEÍCULO (MOTORISTA) ---
export const TelaVeiculo = () => (
    <div className="subtela-container">
        <h2 className="subtela-titulo">Meu Veículo</h2>
        <p className="subtela-desc">Dados do veículo aprovado pelo administrador.</p>

        <div className="veiculo-card-display">
            <CarFront size={32} color="#00E5FF" />
            <div className="veiculo-detalhes-grid">
                <div className="detalhe-item"><span>Modelo</span><p>Fiat Argo</p></div>
                <div className="detalhe-item"><span>Placa</span><p className="placa-badge">QWE-9999</p></div>
            </div>
        </div>
        <div className="status-aprovacao approved">
            <BadgeCheck size={16} /> <span>Aprovado</span>
        </div>
    </div>
);

// --- 7. GANHOS (MOTORISTA) ---
export const TelaGanhos = () => (
    <div className="subtela-container">
        <h2 className="subtela-titulo">Carteira / Repasses</h2>
        <p className="subtela-desc">Saldo de repasses disponíveis para saque.</p>

        <div className="saldo-card-matte uber-style">
            <p className="saldo-label">Seu Saldo</p>
            <h1 className="saldo-valor">R$ 452,50</h1>
            <div className="saldo-acoes">
               <button className="btn-saque-uber">
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                       Fazer Saque
                   </div>
               </button>
            </div>
            
            <div className="saldo-divider"></div>
            
            <div className="transacoes-recentes">
                <h3 className="transacoes-titulo">Atividade Recente</h3>
                <div className="transacao-item">
                    <div className="transacao-icone"><TrendingUp color="#34C759" size={20} /></div>
                    <div className="transacao-detalhes">
                        <span className="transacao-nome">Repasse de Viagem</span>
                        <span className="transacao-data">Ontem às 14:30</span>
                    </div>
                    <span className="transacao-valor positivo">+ R$ 14,50</span>
                </div>
                <div className="transacao-item">
                    <div className="transacao-icone"><Wallet color="#EF4444" size={20} /></div>
                    <div className="transacao-detalhes">
                        <span className="transacao-nome">Saque para Conta</span>
                        <span className="transacao-data">23 de Mai, 10:00</span>
                    </div>
                    <span className="transacao-valor">− R$ 200,00</span>
                </div>
            </div>
        </div>
    </div>
);