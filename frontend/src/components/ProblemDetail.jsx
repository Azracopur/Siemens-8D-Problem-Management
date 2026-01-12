import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    IxButton, IxTypography, IxCard, IxDivider, IxIcon, IxInput, IxSpinner, showToast, IxTextarea 
} from '@siemens/ix-react';
import * as XLSX from 'xlsx';

const translations = {
    en: {
        back: "Back to Dashboard",
        export: "Export to Excel",
        title: "Root Cause Analysis (D4-D5)",
        problem: "Problem",
        description: "D2 - DESCRIPTION",
        startAnalysis: "Start 5 Why Analysis",
        why: "WHY?",
        rootCause: "ROOT CAUSE",
        permanentAction: "D5 - PERMANENT ACTION",
        addWhy: "+ Add Why",
        markRoot: "Mark Root",
        edit: "Edit Analysis",
        new: "New Analysis",
        deleteTitle: "Delete this cause?",
        deleteWarning: "Warning: Deleting this cause will also **permanently remove all sub-causes**.",
        cancel: "Cancel",
        deleteBtn: "Yes, Delete All",
        save: "Save",
        defineRoot: "Define Root Cause",
        actionLabel: "D5 - Permanent Action",
        actionPlaceholder: "Enter solution..."
    },
    tr: {
        back: "Listeye Dön",
        export: "Excel'e Aktar",
        title: "Kök Neden Analizi (D4-D5)",
        problem: "Problem",
        description: "D2 - AÇIKLAMA",
        startAnalysis: "5 Neden Analizini Başlat",
        why: "NEDEN?",
        rootCause: "KÖK NEDEN",
        permanentAction: "D5 - KALICI AKSİYON",
        addWhy: "+ Neden Ekle",
        markRoot: "Kök Neden Yap",
        edit: "Analizi Düzenle",
        new: "Yeni Analiz Katmanı",
        deleteTitle: "Bu neden silinsin mi?",
        deleteWarning: "Uyarı: Bu nedenin silinmesi buna bağlı **tüm alt nedenleri de kalıcı olarak silecektir**.",
        cancel: "İptal",
        deleteBtn: "Evet, Tümünü Sil",
        save: "Kaydet",
        defineRoot: "Kök Neden Tanımla",
        actionLabel: "D5 - Kalıcı Çözüm/Aksiyon",
        actionPlaceholder: "Çözümü buraya yazın..."
    }
};

const treeStyles = `
  .tree-branch { border-left: 2px solid var(--theme-color-3); margin-left: 48px; padding-left: 32px; margin-top: 20px; position: relative; }
  .tree-branch::before { content: ""; position: absolute; left: 0; top: 35px; width: 32px; height: 2px; background-color: var(--theme-color-3); }
  .root-cause-active { border: 1px solid var(--theme-color-alarm) !important; background-color: rgba(255, 77, 77, 0.05) !important; }
`;

export default function ProblemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lang] = useState(localStorage.getItem('appLang') || 'en');
    const t = translations[lang];

    const [problem, setProblem] = useState(null);
    const [causes, setCauses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRootInput, setShowRootInput] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [parentId, setParentId] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [editingNode, setEditingNode] = useState(null);
    const [formData, setFormData] = useState({ content: '', action: '' });

    const loadData = async () => {
    setLoading(true);
    try {
        
        const probRes = await fetch(`http://localhost:8000/api/problems.php?t=${Date.now()}`);
        const probData = await probRes.json();
        setProblem(probData.find(p => p.id == id));

        const treeRes = await fetch(`http://localhost:8000/api/get_tree_data.php?problem_id=${id}&t=${Date.now()}`);
        const treeData = await treeRes.json();
        setCauses(treeData); 
    } catch (err) { 
        showToast({ message: "Error Loading Data", type: 'error' }); 
    } finally { 
        setLoading(false); 
    }
};

    useEffect(() => { loadData(); }, [id]);
    

  
    const handleStatusUpdate = async (statusOverride) => {
        try {
            await fetch('http://localhost:8000/api/update_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ problem_id: id, status: statusOverride })
            });
            loadData();
        } catch (error) { console.error("Status Update Failed", error); }
    };

    const exportToExcel = () => {
        if (!causes || causes.length === 0) { showToast({ message: "No data", type: 'info' }); return; }
        const rows = [];
        const flatten = (nodes, level = 0) => {
            nodes.forEach(n => {
                rows.push({
                    "Hierarchy": "  ".repeat(level) + "> Level " + (level + 1),
                    "Reason": n.content,
                    "Is Root Cause": n.is_root_cause == 1 ? "YES" : "NO",
                    "D5 Action": n.permanent_action || "-"
                });
                if (n.children) flatten(n.children, level + 1);
            });
        };
        flatten(causes);
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Analysis");
        XLSX.writeFile(workbook, `Analysis_${id}.xlsx`);
    };

    const confirmDelete = async () => {
        try {
            await fetch('http://localhost:8000/api/delete_node.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedNode.id })
            });
            
            if (selectedNode.is_root_cause == 1) { await handleStatusUpdate('Open'); }
            setShowDeleteModal(false); loadData();
            showToast({ message: lang === 'tr' ? "Silindi" : "Deleted", type: 'success' });
        } catch (err) { showToast({ message: "Delete Error", type: 'error' }); }
    };

    const handleSave = async () => {
    const endpoint = editingNode ? 'http://localhost:8000/api/update_node.php' : 'http://localhost:8000/api/create_root_cause.php';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingNode 
                ? { id: editingNode.id, content: formData.content, permanent_action: formData.action } 
                : { content: formData.content, problem_id: id, parent_id: parentId })
        });

        if (response.ok) {
            setShowAddModal(false);
            setEditingNode(null);
            setFormData({ content: '', action: '' });
            
            
            await loadData(); 
            showToast({ message: lang === 'tr' ? "Güncellendi" : "Updated", type: 'success' });
        }
    } catch (err) {
        showToast({ message: "Network Error", type: 'error' });
    }
};
     
    const handleMarkRoot = async () => {
        if (!formData.action.trim()) { showToast({ message: "Action required!", type: 'warning' }); return; }
        try {
            const res = await fetch('http://localhost:8000/api/mark_root_cause.php', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedNode.id, is_root_cause: 1, permanent_action: formData.action })
            });
            if (res.ok) {
             
                await handleStatusUpdate('Resolved');
                setShowRootInput(false); setFormData({ content: '', action: '' });
                showToast({ message: lang === 'tr' ? "Kök Neden ve Problem Çözüldü" : "Root Cause & Problem Resolved", type: 'success' });
            }
        } catch (err) { showToast({ message: "Network Error", type: 'error' }); }
    };

    const renderTree = (nodes) => {
        if (!nodes || nodes.length === 0) return null;
        return nodes.map((node) => (
            <div key={node.id} className="tree-branch">
                <IxCard className={node.is_root_cause == 1 ? "root-cause-active" : ""} style={{ width: '500px', backgroundColor: 'var(--theme-color-1)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <IxTypography variant="label-small" color="primary">{t.why}</IxTypography>
                        {node.is_root_cause == 1 && <span style={{ backgroundColor: 'var(--theme-color-alarm)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>{t.rootCause}</span>}
                    </div>
                    <IxTypography variant="h5" style={{ margin: '8px 0', color: 'var(--theme-color-std-text)' }}>{node.content}</IxTypography>
                    {node.is_root_cause == 1 && (
                        <div style={{ marginTop: '12px', borderTop: '1px solid var(--theme-color-3)', paddingTop: '12px' }}>
                            <IxTypography variant="label-small" style={{ color: 'var(--theme-color-alarm)' }}>{t.permanentAction}</IxTypography>
                            <IxTypography variant="body" style={{ color: 'var(--theme-color-soft-text)' }}>{node.permanent_action}</IxTypography>
                        </div>
                    )}
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {!node.is_root_cause && <IxButton variant="primary" outline size="16" onClick={() => { setSelectedNode(node); setShowRootInput(true); }}>{t.markRoot}</IxButton>}
                            <IxButton variant="primary" outline size="16" onClick={() => { setParentId(node.id); setEditingNode(null); setFormData({content:'', action:''}); setShowAddModal(true); }}>{t.addWhy}</IxButton>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <IxButton ghost size="16" onClick={() => { setEditingNode(node); setFormData({content: node.content, action: node.permanent_action || ''}); setShowAddModal(true); }}><IxIcon name="pen" /></IxButton>
                            <IxButton ghost variant="danger" size="16" onClick={() => { setSelectedNode(node); setShowDeleteModal(true); }}><IxIcon name="trashcan" /></IxButton>
                        </div>
                    </div>
                </IxCard>
                {node.children && renderTree(node.children)}
            </div>
        ));
    };
    if (loading) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: 'var(--theme-color-1)' 
            }}>
                <IxSpinner size="large" />
                <IxTypography variant="h4" style={{ marginTop: '16px', color: 'var(--theme-color-primary)' }}>
                    {lang === 'tr' ? 'Veriler Yükleniyor...' : 'Loading Data...'}
                </IxTypography>
            </div>
        );
    }
    return (
        <div style={{ padding: '32px', backgroundColor: 'var(--theme-color-1)', minHeight: '100vh', color: 'var(--theme-color-std-text)' }}>
            <style>{treeStyles}</style>
            
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '32px' }}>
                <IxButton variant="secondary" outline onClick={() => navigate('/')}><IxIcon name="chevron-left" /> {t.back}</IxButton>
                <IxButton variant="primary" outline onClick={exportToExcel}><IxIcon name="download" /> {t.export}</IxButton>
            </div>

            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', alignItems: 'stretch' , maxWidth: '900px'}}>
                
               
                <IxCard style={{ flex: '0 0 250px', padding: '20px', backgroundColor: 'var(--theme-color-1)', borderLeft: '4px solid var(--theme-color-primary)' }}>
                    <IxTypography variant="label-small" style={{ color: 'var(--theme-color-primary)', fontWeight: 'bold' }}>
                        {lang === 'tr' ? 'D1 - SORUMLU EKİP' : 'D1 - RESPONSIBLE TEAM'}
                    </IxTypography>
                    <IxTypography variant="h5" style={{ marginTop: '12px', color: 'var(--theme-color-std-text)' }}>
                        {problem?.responsible_team || '-'}
                    </IxTypography>
                </IxCard>

              
                <IxCard style={{ flex: '1', minWidth: '450px', padding: '20px', backgroundColor: 'var(--theme-color-1)', borderLeft: '4px solid var(--theme-color-alarm)' }}>
                    <IxTypography variant="label-small" style={{ color: 'var(--theme-color-alarm)', fontWeight: 'bold' }}>
                        {t.description}
                    </IxTypography>
                    <IxTypography 
                        variant="h4" 
                        style={{ 
                            marginTop: '10px', 
                            color: 'var(--theme-color-primary)', 
                            fontWeight: '700', 
                            textTransform: 'uppercase' 
                        }}
                    >
                        {problem?.description}
                    </IxTypography>
                    <IxButton style={{ marginTop: '20px' }} onClick={() => { setParentId(null); setEditingNode(null); setFormData({content:'', action:''}); setShowAddModal(true); }}>
                        {t.startAnalysis}
                    </IxButton>
                </IxCard>
            </div>

            <IxTypography variant="h4" style={{ 
                marginTop: '32px', 
                color: 'var(--theme-color-primary)', 
                fontWeight: '700', 
                borderBottom: '2px solid var(--theme-color-primary)', 
                paddingBottom: '8px',
                display: 'inline-block' 
            }}>
                {t.problem}: {problem?.title} 
                {problem?.status === 'Resolved' && (
                    <span style={{color: 'var(--theme-color-success)', marginLeft: '10px'}}> 
                        (✓ {lang === 'tr' ? 'Çözüldü' : 'Resolved'}) 
                    </span>
                )}
            </IxTypography>


            <div style={{ marginTop: '30px' }}>{renderTree(causes)}</div>
            

    

          
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <IxCard style={{ width: '500px', padding: '32px', backgroundColor: 'var(--theme-color-1)' }}>
                        <IxTypography variant="h3">{editingNode ? t.edit : t.new}</IxTypography>
                        <IxTextarea label={t.why} value={formData.content} onValueChange={(e) => setFormData({...formData, content: e.detail})} />
                        {editingNode && editingNode.is_root_cause == 1 && <IxTextarea label={t.actionLabel} value={formData.action} onValueChange={(e) => setFormData({...formData, action: e.detail})} style={{marginTop: '16px'}} />}
                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <IxButton variant="secondary" ghost onClick={() => setShowAddModal(false)}>{t.cancel}</IxButton>
                            <IxButton variant="primary" onClick={handleSave}>{t.save}</IxButton>
                        </div>
                    </IxCard>
                </div>
            )}
            {showRootInput && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001, backdropFilter: 'blur(4px)' }}>
                    <IxCard style={{ width: '500px', padding: '32px', border: '1px solid var(--theme-color-alarm)', backgroundColor: 'var(--theme-color-1)' }}>
                        <IxTypography variant="h3" style={{ color: 'var(--theme-color-alarm)' }}>{t.defineRoot}</IxTypography>
                        <IxTextarea label={t.actionLabel} placeholder={t.actionPlaceholder} value={formData.action} onValueChange={(e) => setFormData({...formData, action: e.detail})} />
                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <IxButton variant="secondary" ghost onClick={() => setShowRootInput(false)}>{t.cancel}</IxButton>
                            <IxButton variant="danger" onClick={handleMarkRoot}>{t.save}</IxButton>
                        </div>
                    </IxCard>
                </div>
            )}
            {showDeleteModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, backdropFilter: 'blur(4px)' }}>
                    <IxCard style={{ width: '450px', padding: '32px', textAlign: 'center', backgroundColor: 'var(--theme-color-1)' }}>
                        <IxIcon name="trashcan" size="32" style={{ color: 'var(--theme-color-alarm)', marginBottom: '16px' }} />
                        <IxTypography variant="h4" style={{ marginBottom: '12px' }}>{t.deleteTitle}</IxTypography>
                        <IxTypography variant="body" style={{ color: 'var(--theme-color-soft-text)', marginBottom: '24px' }}>{t.deleteWarning}</IxTypography>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <IxButton variant="secondary" ghost onClick={() => setShowDeleteModal(false)}>{t.cancel}</IxButton>
                            <IxButton variant="danger" onClick={confirmDelete}>{t.deleteBtn}</IxButton>
                        </div>
                    </IxCard>
                </div>
            )}
        </div>
    );
}