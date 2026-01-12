import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
    IxButton, IxInput, IxTypography, IxCard, IxDivider, IxTextarea, IxSpinner, showToast 
} from '@siemens/ix-react';
import { useNavigate } from 'react-router-dom';

const gridStyle = `
  .ag-theme-quartz-dark {
      --ag-background-color: var(--theme-color-background); 
      --ag-header-background-color: var(--theme-color-1);
      --ag-foreground-color: var(--theme-color-std-text);
      --ag-border-color: var(--theme-color-3);
      --ag-header-foreground-color: var(--theme-color-primary);
      --ag-font-family: 'Siemens Sans', sans-serif;
      --ag-font-size: 14px;
      --ag-row-hover-color: rgba(0, 255, 185, 0.05);
  }
  .ag-header-cell-label { 
      font-weight: 600; 
      text-transform: uppercase; 
      letter-spacing: 0.05em; 
      font-size: 11px; 
  }
  .ag-root-wrapper { border-radius: 4px; border: 1px solid var(--theme-color-3); }
  .ag-cell { display: flex; align-items: center; color: var(--theme-color-std-text) !important; }
`;


const translations = {
    en: {
        title: "8D Problem Management",
        subtitle: "8D Methodology Digital Solution Platform",
        newBtn: "+ New Problem",
        modalTitle: "Register New Problem",
        labelTitle: "Problem Title",
        labelTeam: "Responsible Team",
        labelDesc: "Description",
        btnCancel: "Cancel",
        btnSave: "Save",
        colId: "ID",
        colTitle: "Problem Title",
        colTeam: "Responsible Team",
        colStatus: "Status",
        colDate: "Timestamp",
        statusOpen: "OPEN",
        msgLoadError: "Failed to load data!",
        msgFieldsError: "Please fill in all fields!",
        msgSuccess: "Problem saved successfully."
    },
    tr: {
        title: "8D Problem Yönetimi",
        subtitle: "8D Metodolojisi Dijital Çözüm Platformu",
        newBtn: "+ Yeni Problem",
        modalTitle: "Yeni Problem Kaydı",
        labelTitle: "Problem Başlığı",
        labelTeam: "Sorumlu Ekip",
        labelDesc: "Açıklama",
        btnCancel: "İptal",
        btnSave: "Kaydet",
        colId: "ID",
        colTitle: "Problem Başlığı",
        colTeam: "Sorumlu Ekip",
        colStatus: "Durum",
        colDate: "Tarih",
        statusOpen: "AÇIK",
        msgLoadError: "Veriler yüklenemedi!",
        msgFieldsError: "Lütfen tüm alanları doldurun!",
        msgSuccess: "Problem başarıyla kaydedildi."
    }
};

export default function Dashboard() {
    const [lang, setLang] = useState(localStorage.getItem('appLang') || 'en'); 
    const t = translations[lang];
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [newProblem, setNewProblem] = useState({ title: '', description: '', responsible_team: '' });
    const navigate = useNavigate();
    const changeLanguage = (newLang) => {
        setLang(newLang);
        localStorage.setItem('appLang', newLang); 
        
    };

    const fetchProblems = async () => {
        setLoading(true); 
        try {
            const response = await fetch('http://localhost:8000/api/problems.php');
            const data = await response.json();
            setRowData(data);
        } catch (err) {
            showToast({ message: t.msgLoadError, type: 'error' }); 
        } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const handleSave = async () => {
        if (!newProblem.title.trim() || !newProblem.responsible_team.trim()) {
            showToast({ message: t.msgFieldsError, type: 'info' });
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/create_problem.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProblem)
            });
            if (response.ok) {
                showToast({ message: t.msgSuccess, type: 'success' }); 
                setShowModal(false);
                setNewProblem({ title: '', description: '', responsible_team: '' });
                fetchProblems();
            }
        } catch (error) { showToast({ message: "Error occurred.", type: 'error' }); }
    };

   
    const colDefs = [
        { field: "id", headerName: t.colId, width: 80, cellStyle: { fontWeight: '700', color: 'var(--theme-color-primary)' } },
        { field: "title", headerName: t.colTitle, flex: 1.5 },
        { field: "responsible_team", headerName: t.colTeam, flex: 1.5 },
        { 
            field: "status", headerName: t.colStatus, width: 140,
            cellRenderer: (params) => {
                const isOpen = params.value === 'Open';
                let statusText = params.value?.toUpperCase(); 
            if (lang === 'tr') {
                statusText = isOpen ? 'AÇIK' : 'ÇÖZÜLDÜ';
            } else {
                statusText = isOpen ? 'OPEN' : 'RESOLVED';
            }
                const color = isOpen ? 'var(--theme-color-alarm)' : 'var(--theme-color-success)';
                
                return (
                    <span style={{
                        color: color, fontWeight: 'bold', border: `1px solid ${color}`,
                        padding: '4px 12px', borderRadius: '16px', fontSize: '11px',
                        backgroundColor: isOpen ? 'rgba(255, 61, 61, 0.1)' : 'rgba(0, 255, 185, 0.1)'
                    }}>{statusText}</span>
                );
            }
        },
        { field: "created_at", headerName: t.colDate, width: 200 }
    ];

    return (
        <div style={{ 
            padding: '24px', 
            backgroundColor: 'var(--theme-color-1)', 
            minHeight: '100vh', 
            fontFamily: 'Siemens Sans, sans-serif' 
        }}>
            <style>{gridStyle}</style>

            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}>
            <IxButton 
                ghost 
                size="16" 
                onClick={() => changeLanguage('en')} 
                style={{ color: lang === 'en' ? 'var(--theme-color-primary)' : 'white' }}
            >
                EN
            </IxButton>
            <IxButton 
                ghost 
                size="16" 
                onClick={() => changeLanguage('tr')} 
                style={{ color: lang === 'tr' ? 'var(--theme-color-primary)' : 'white' }}
            >
                TR
            </IxButton>
        </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <IxTypography variant="h1" color="primary">{t.title}</IxTypography>
                    <IxTypography variant="body-soft" style={{ color: 'var(--theme-color-soft-text)' }}>
                        {t.subtitle}
                    </IxTypography>
                </div>
                <IxButton variant="primary" onClick={() => setShowModal(true)}>{t.newBtn}</IxButton>
            </div>

            <IxDivider style={{ marginBottom: '32px' }} />

            <div className="ag-theme-quartz-dark" style={{ height: '600px', width: '100%', position: 'relative' }}>
                {loading && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10, backgroundColor: 'rgba(15, 25, 34, 0.5)' }}>
                        <IxSpinner size="large" />
                    </div>
                )}
                <AgGridReact 
                    key={lang} 
                    theme="legacy"
                    rowData={rowData} 
                    columnDefs={colDefs} 
                    pagination={true}
                    rowHeight={55}
                    onRowClicked={(event) => navigate(`/problem/${event.data.id}`)}
                />
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <IxCard style={{ width: '500px', padding: '32px', backgroundColor: 'var(--theme-color-1)' }}>
                        <IxTypography variant="h3" style={{ marginBottom: '24px', color: 'var(--theme-color-std-text)' }}>{t.modalTitle}</IxTypography>
                        <IxInput label={t.labelTitle} value={newProblem.title} onValueChange={(e) => setNewProblem({...newProblem, title: e.detail})} />
                        <IxInput label={t.labelTeam} value={newProblem.responsible_team} onValueChange={(e) => setNewProblem({...newProblem, responsible_team: e.detail})} style={{ marginTop: '16px' }} />
                        <IxTextarea label={t.labelDesc} value={newProblem.description} onValueChange={(e) => setNewProblem({...newProblem, description: e.detail})} style={{ marginTop: '16px' }} />
                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <IxButton variant="secondary" ghost onClick={() => setShowModal(false)}>{t.btnCancel}</IxButton>
                            <IxButton variant="primary" onClick={handleSave}>{t.btnSave}</IxButton>
                        </div>
                    </IxCard>
                </div>
            )}
        </div>
    );
}