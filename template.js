/**
 * [다중 양식 메모 보드 - 클라우드 프록시 호환 버전]
 * Firebase 개별 종속성을 제거하고 순수 LocalStorage 로직으로 롤백했습니다.
 * 클라우드 동기화는 app.js의 글로벌 프록시가 자동으로 전담합니다.
 */
window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Template = window.QA_CORE.Template || {};

window.QA_CORE.Template.Manager = {
    memos: [],
    categories: [], 
    currentFilter: '전체', 

    init() {
        this.ensureDomExists();
        this.loadData();
        this.renderLayout();
        this.bindGlobalEvents();
    },

    ensureDomExists() {
        let panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                panelZone = document.createElement('div');
                panelZone.id = 'tab-panel-template';
                panelZone.className = 'content-panel';
                mainContent.appendChild(panelZone);
            }
        }
    },

    loadData() {
        const defaultCategories = ['기본'];
        
        const catData = localStorage.getItem('QA_CORE_MEMO_CATEGORIES');
        if (catData) {
            try { 
                this.categories = JSON.parse(catData); 
                if (this.categories.includes('위나라')) {
                    this.categories = [...defaultCategories];
                }
            } 
            catch(e) { this.categories = [...defaultCategories]; }
        } else {
            this.categories = [...defaultCategories];
        }

        const data = localStorage.getItem('QA_CORE_MEMO_TEMPLATES');
        if (data) {
            try { 
                const parsedData = JSON.parse(data);
                this.memos = parsedData.map(m => ({
                    id: m.id,
                    title: m.title || "", 
                    content: m.content || "",
                    category: this.categories.includes(m.category) ? m.category : this.categories[0]
                }));
            } catch(e) { 
                this.memos = []; 
            }
        } 
        
        if (this.memos.length === 0) {
            this.memos = [{
                id: Date.now(),
                category: this.categories[0],
                content: "[Environment]\n■ PoC : \n■ Device(OS Ver.) : \n■ App : \n■ Server : \n\n[Pre-Condition]\n1. \n\n[재현스텝]\n1. \n2. \n3. \n\n[실행결과-문제현상]\n1. \n\n[기대결과]\n1. "
            }];
        }
    },

    saveData() {
        // 💡 오직 localStorage만 호출합니다. 서버 전송은 app.js가 알아서 가로채서 수행합니다.
        localStorage.setItem('QA_CORE_MEMO_TEMPLATES', JSON.stringify(this.memos));
        localStorage.setItem('QA_CORE_MEMO_CATEGORIES', JSON.stringify(this.categories));
    },

    renderLayout() {
        const panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) return;

        const filterButtonsHtml = ['전체', ...this.categories].map(cat => {
            const isActive = this.currentFilter === cat;
            const bg = isActive ? '#0ea5e9' : '#ffffff';
            const color = isActive ? '#ffffff' : '#475569';
            const border = isActive ? 'border: 1px solid #0ea5e9;' : 'border: 1px solid #cbd5e0;';
            const shadow = isActive ? 'box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);' : 'box-shadow: 0 1px 2px rgba(0,0,0,0.05);';
            return `<button class="btn-memo-filter" data-filter="${cat}" style="background: ${bg}; color: ${color}; ${border} ${shadow} padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;">${cat}</button>`;
        }).join('');

        panelZone.innerHTML = `
            <div style="width: 100%; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; min-height: 600px; box-sizing: border-box; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 2px solid #cbd5e0; padding-bottom: 16px;">
                    <div>
                        <h2 style="font-size: 1.3rem; font-weight: 800; color: #1e293b; margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px;">📝 다중 양식 메모 보드</h2>
                        
                        <div id="memo-filter-bar" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                            ${filterButtonsHtml}
                            <button id="btn-open-tab-manager" style="background: transparent; color: #64748b; border: 1px dashed #94a3b8; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; margin-left: 4px; transition: all 0.2s;">⚙️ 탭 편집</button>
                        </div>
                    </div>
                    
                    <button id="btn-add-memo" style="background:#0284c7; color:white; border:none; padding:8px 16px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2); transition: background 0.2s;">
                        + 새 칸 추가
                    </button>
                </div>
                
                <div id="memo-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; width: 100%; align-items: start;">
                </div>

                <div id="tab-manager-modal" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 50; justify-content: center; align-items: center; border-radius: 8px;">
                    <div style="background: #ffffff; width: 400px; border-radius: 8px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <h3 style="margin: 0 0 16px 0; font-size: 1.1rem; font-weight: 700; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">⚙️ 탭 메뉴 관리</h3>
                        <div id="tab-manager-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; margin-bottom: 16px;">
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <button id="btn-add-new-tab" style="background: #0ea5e9; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">+ 새 탭 추가</button>
                            <button id="btn-close-tab-manager" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">완료 / 닫기</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.renderMemos();
    },

    renderTabManagerList() {
        const listContainer = document.getElementById('tab-manager-list');
        if (!listContainer) return;

        listContainer.innerHTML = this.categories.map((cat) => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e0; padding: 8px 12px; border-radius: 4px;">
                <span style="font-size: 13px; font-weight: 700; color: #334155;">${cat}</span>
                <div style="display: flex; gap: 4px;">
                    <button class="btn-edit-tab" data-old="${cat}" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e0; padding: 4px 8px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">수정</button>
                    <button class="btn-delete-tab" data-old="${cat}" style="background: #fee2e2; color: #dc2626; border: 1px solid #f87171; padding: 4px 8px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">삭제</button>
                </div>
            </div>
        `).join('');

        listContainer.querySelectorAll('.btn-edit-tab').forEach(btn => {
            btn.onclick = (e) => {
                const oldName = e.target.getAttribute('data-old');
                const newName = prompt(`'${oldName}' 탭의 새 이름을 입력하세요:`, oldName);
                if (newName && newName.trim() !== '' && newName !== oldName) {
                    if (this.categories.includes(newName.trim())) {
                        alert("이미 존재하는 탭 이름입니다."); return;
                    }
                    const idx = this.categories.indexOf(oldName);
                    if (idx > -1) this.categories[idx] = newName.trim();
                    
                    this.memos.forEach(m => { if (m.category === oldName) m.category = newName.trim(); });
                    if (this.currentFilter === oldName) this.currentFilter = newName.trim();
                    
                    this.saveData();
                    this.renderLayout();
                    this.renderTabManagerList(); 
                    document.getElementById('tab-manager-modal').style.display = 'flex';
                }
            };
        });

        listContainer.querySelectorAll('.btn-delete-tab').forEach(btn => {
            btn.onclick = (e) => {
                if (this.categories.length <= 1) {
                    alert("최소 1개의 탭 메뉴는 유지해야 합니다."); return;
                }
                const oldName = e.target.getAttribute('data-old');
                if (confirm(`'${oldName}' 탭을 삭제하시겠습니까?\n해당 탭에 포함된 메모는 삭제되지 않으며, 다른 탭으로 자동 이동됩니다.`)) {
                    this.categories = this.categories.filter(c => c !== oldName);
                    const fallbackCategory = this.categories[0];
                    this.memos.forEach(m => { if (m.category === oldName) m.category = fallbackCategory; });

                    if (this.currentFilter === oldName) this.currentFilter = '전체';
                    this.saveData();
                    this.renderLayout();
                    this.renderTabManagerList();
                    document.getElementById('tab-manager-modal').style.display = 'flex';
                }
            };
        });
    },

    renderMemos() {
        const container = document.getElementById('memo-grid-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        const filteredMemos = this.currentFilter === '전체' 
            ? this.memos 
            : this.memos.filter(m => m.category === this.currentFilter);
        
        filteredMemos.forEach(memo => {
            const card = document.createElement('div');
            card.style.cssText = "background: #ffffff; border: 1px solid #cbd5e0; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.03); width: 100%; box-sizing: border-box;";
            
            const categoryOptions = this.categories.map(cat => 
                `<option value="${cat}" ${memo.category === cat ? 'selected' : ''}>${cat}</option>`
            ).join('');

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <select class="memo-category-select" data-id="${memo.id}" style="flex: 1; border: 1px solid #cbd5e0; border-radius: 4px; padding: 6px; font-size: 12px; font-weight: 700; color: #334155; outline: none; background: #f8fafc; cursor: pointer;">
                        ${categoryOptions}
                    </select>
                    <div style="display: flex; gap: 4px; flex-shrink: 0;">
                        <button class="btn-copy-memo" data-id="${memo.id}" style="background: #e0f2fe; color: #0284c7; border: none; padding: 6px 10px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">복사</button>
                        <button class="btn-delete-memo" data-id="${memo.id}" style="background: #fee2e2; color: #dc2626; border: none; padding: 6px 10px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">삭제</button>
                    </div>
                </div>
                <textarea class="memo-textarea" data-id="${memo.id}" style="width: 100%; height: 320px; resize: vertical; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px; font-family: 'Malgun Gothic', sans-serif; font-size: 12px; line-height: 1.5; color: #334155; outline: none; box-sizing: border-box; background: #f8fafc;" placeholder="여기에 내용을 입력하세요...">${memo.content}</textarea>
            `;
            container.appendChild(card);
        });

        const addCard = document.createElement('div');
        addCard.id = "btn-add-memo-card";
        addCard.style.cssText = "background: #f1f5f9; border: 2px dashed #cbd5e0; border-radius: 6px; display: flex; justify-content: center; align-items: center; cursor: pointer; min-height: 375px; transition: all 0.2s;";
        addCard.innerHTML = `<span style="color: #64748b; font-weight: 700; font-size: 14px;">+ 새 메모 칸 추가</span>`;
        container.appendChild(addCard);
        
        this.bindDynamicEvents();
    },

    bindGlobalEvents() {
        const panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) return;
        
        panelZone.onclick = (e) => {
            if (e.target.classList.contains('btn-memo-filter')) {
                this.currentFilter = e.target.getAttribute('data-filter');
                this.renderLayout(); 
            }

            if (e.target.id === 'btn-open-tab-manager') {
                this.renderTabManagerList();
                document.getElementById('tab-manager-modal').style.display = 'flex';
            }
            if (e.target.id === 'btn-close-tab-manager') {
                document.getElementById('tab-manager-modal').style.display = 'none';
            }
            if (e.target.id === 'btn-add-new-tab') {
                const newTabName = prompt("추가할 새 탭 메뉴의 이름을 입력하세요:");
                if (newTabName && newTabName.trim() !== '') {
                    if (this.categories.includes(newTabName.trim())) {
                        alert("이미 존재하는 탭 이름입니다."); return;
                    }
                    this.categories.push(newTabName.trim());
                    this.saveData();
                    this.renderLayout();
                    this.renderTabManagerList(); 
                    document.getElementById('tab-manager-modal').style.display = 'flex';
                }
            }
            if (e.target.id === 'btn-add-memo') {
                const newCategory = this.currentFilter === '전체' ? this.categories[0] : this.currentFilter;
                this.memos.push({ id: Date.now(), title: "", content: "", category: newCategory });
                this.saveData();
                this.renderMemos();
            }
        };
    },

    bindDynamicEvents() {
        const container = document.getElementById('memo-grid-container');
        if (!container) return;

        const addCardBtn = document.getElementById('btn-add-memo-card');
        if (addCardBtn) {
            addCardBtn.onclick = () => {
                const newCategory = this.currentFilter === '전체' ? this.categories[0] : this.currentFilter;
                this.memos.push({ id: Date.now(), title: "", content: "", category: newCategory });
                this.saveData();
                this.renderMemos();
            };
            addCardBtn.onmouseover = () => addCardBtn.style.background = '#e2e8f0';
            addCardBtn.onmouseout = () => addCardBtn.style.background = '#f1f5f9';
        }

        container.querySelectorAll('.memo-category-select').forEach(select => {
            select.onchange = (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const memo = this.memos.find(m => m.id === id);
                if (memo) {
                    memo.category = e.target.value;
                    this.saveData();
                    if (this.currentFilter !== '전체' && this.currentFilter !== memo.category) {
                        if (window.QA_CORE.UI && typeof window.QA_CORE.UI.showToast === 'function') {
                            window.QA_CORE.UI.showToast(`✅ [${memo.category}] 탭으로 이동되었습니다.`);
                        }
                        this.renderMemos(); 
                    }
                }
            };
        });

        container.querySelectorAll('.memo-textarea').forEach(ta => {
            ta.oninput = (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const memo = this.memos.find(m => m.id === id);
                if (memo) { memo.content = e.target.value; this.saveData(); }
            };
        });

        container.querySelectorAll('.btn-copy-memo').forEach(btn => {
            btn.onclick = (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const memo = this.memos.find(m => m.id === id);
                if (memo && memo.content) {
                    navigator.clipboard.writeText(memo.content).then(() => {
                        if (window.QA_CORE.UI && typeof window.QA_CORE.UI.showToast === 'function') {
                            window.QA_CORE.UI.showToast("✅ 클립보드에 복사되었습니다.");
                        } else { alert("✅ 클립보드에 복사되었습니다."); }
                    }).catch(() => alert("복사에 실패했습니다."));
                }
            };
        });

        container.querySelectorAll('.btn-delete-memo').forEach(btn => {
            btn.onclick = (e) => {
                if(confirm("해당 메모를 완전히 삭제하시겠습니까? (복구 불가)")) {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    this.memos = this.memos.filter(m => m.id !== id);
                    this.saveData();
                    this.renderMemos();
                }
            };
        });
    }
};

export function initTemplatePanel() {
    window.QA_CORE.Template.Manager.init();
}
