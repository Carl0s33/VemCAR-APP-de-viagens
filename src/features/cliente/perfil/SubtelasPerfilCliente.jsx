import React from "react";
import {
    CreditCard, MapPin, Wallet, Plus, Home, GraduationCap,
    ShieldCheck
} from "lucide-react";
import "./SubtelasPerfilCliente.css";

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
