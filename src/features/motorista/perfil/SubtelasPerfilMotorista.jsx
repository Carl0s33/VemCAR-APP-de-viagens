import React from "react";
import {
    CarFront, BadgeCheck, ShieldCheck, ShieldAlert
} from "lucide-react";
import "./SubtelasPerfilMotorista.css";

export const TelaInfo = ({ onSave }) => (
    <div className="subtela-container">
        <h2 className="subtela-titulo">Informações Pessoais</h2>
        <p className="subtela-desc">Dados cadastrais do motorista parceiro no VEM CAR.</p>

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

export const TelaVeiculo = () => (
    <div className="subtela-container">
        <h2 className="subtela-titulo">Meu Veículo</h2>
        <p className="subtela-desc">Dados do veículo em análise documental pela moderação.</p>

        <div className="veiculo-card-display">
            <CarFront size={32} color="#00E5FF" />
            <div className="veiculo-detalhes-grid">
                <div className="detalhe-item"><span>Modelo</span><p>Fiat Argo</p></div>
                <div className="detalhe-item"><span>Placa</span><p className="placa-badge" style={{background: '#333', color: '#FFF'}}>QWE-9999</p></div>
            </div>
        </div>
        <div className="status-aprovacao" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#F59E0B' }}>
            <ShieldAlert size={16} /> <span>Em Análise Documental</span>
        </div>
    </div>
);

export const TelaGanhos = () => (
    <div className="subtela-container">
        <div style={{ background: 'linear-gradient(135deg, #111 0%, #000 100%)', margin: '-40px -24px 24px -24px', padding: '40px 24px 24px 24px', borderBottom: '1px solid #1A1A1A' }}>
            <h2 className="subtela-titulo" style={{ marginBottom: 4 }}>Ganhos</h2>
            <p className="subtela-desc" style={{ marginBottom: 0 }}>Você não tem taxas pendentes com o app.</p>
        </div>

        <div className="saldo-card-matte" style={{ background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.1) 0%, rgba(0, 0, 0, 0) 100%)', border: '1px solid rgba(52, 199, 89, 0.2)', padding: '32px 24px', borderRadius: 24, textAlign: 'center', marginBottom: 24 }}>
            <p style={{ color: '#888', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', marginBottom: 8 }}>Saldo Disponível</p>
            <h1 style={{ color: '#34C759', fontSize: 48, fontWeight: 900, margin: '0 0 24px 0', letterSpacing: '-1px' }}>R$ 452,50</h1>
            <button className="btn-saque-rapido" style={{ background: '#34C759', color: '#000', border: 'none', height: 56, width: '100%', borderRadius: 16, fontSize: 16, fontWeight: 900, cursor: 'pointer', transition: 'transform 0.1s' }}>TRANSFERIR (PIX)</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#FFF', margin: '0 0 8px 0' }}>Histórico da Semana</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: '#111', borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(52, 199, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CarFront size={20} color="#34C759" />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: '#FFF', fontWeight: 700, fontSize: 15 }}>Corrida finalizada</p>
                        <span style={{ color: '#888', fontSize: 12 }}>Hoje, 14:32</span>
                    </div>
                </div>
                <span style={{ color: '#34C759', fontWeight: 800, fontSize: 16 }}>+ R$ 13,00</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: '#111', borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(52, 199, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CarFront size={20} color="#34C759" />
                    </div>
                    <div>
                        <p style={{ margin: 0, color: '#FFF', fontWeight: 700, fontSize: 15 }}>Corrida finalizada</p>
                        <span style={{ color: '#888', fontSize: 12 }}>Hoje, 09:15</span>
                    </div>
                </div>
                <span style={{ color: '#34C759', fontWeight: 800, fontSize: 16 }}>+ R$ 22,50</span>
            </div>
        </div>
    </div>
);
