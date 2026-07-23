/**
 * [다중 양식 메모 보드 - 탭 및 메모 칸 드래그 앤 드롭 순서 변경 호환 마스터 버전]
 * 메인 필터 바, 탭 관리 모달, 그리고 개별 메모 칸(카드)까지 모두 Drag & Drop으로 실시간 순서 변경이 가능한 통합 코드입니다.
 */
window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Template = window.QA_CORE.Template || {};

window.QA_CORE.Template.Manager = {
    memos: [],
    categories: [], 
    currentFilter: '기본',
    draggedCategory: null, // 💡 드래그 중인 카테고리 임시 저장
    draggedMemoId: null,   // 💡 드래그 중인 메모 칸 ID 임시 저장

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
                if (this.categories.includes('위나라')) this.categories = [...defaultCategories];
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
            } catch(e) { this.memos = []; }
        } else {
            this.memos = [];
        }
    },

    saveData() {
        localStorage.setItem('QA_CORE_MEMO_TEMPLATES', JSON.stringify(this.memos));
        localStorage.setItem('QA_CORE_MEMO_CATEGORIES', JSON.stringify(this.categories));
    },

    // 💡 카테고리 순서 배열 변경 및 실시간 동기화 코어 엔진
    reorderCategories(fromCategory, toCategory) {
        if (!fromCategory || !toCategory || fromCategory === toCategory) return;
        
        const fromIndex = this.categories.indexOf(fromCategory);
        const toIndex = this.categories.indexOf(toCategory);
        
        if (fromIndex !== -1 && toIndex !== -1) {
            this.categories.splice(fromIndex, 1);
            this.categories.splice(toIndex, 0, fromCategory);
            
            this.saveData();
            this.renderLayout();
            if (document.getElementById('tab-manager-modal').style.display === 'flex') {
                this.renderTabManagerList();
            }
        }
    },

    // 💡 메모 칸 순서 배열 변경 및 실시간 동기화 코어 엔진
    reorderMemos(fromId, toId) {
        if (!fromId || !toId || fromId === toId) return;
        
        const fromIndex = this.memos.findIndex(m => m.id === fromId);
        const toIndex = this.memos.findIndex(m => m.id === toId);
        
        if (fromIndex !== -1 && toIndex !== -1) {
            const [movedMemo] = this.memos.splice(fromIndex, 1);
            this.memos.splice(toIndex, 0, movedMemo);
            
            this.saveData();
            this.renderMemos();
        }
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
            const draggableAttr = cat !== '전체' ? 'draggable="true"' : '';
            const cursorStyle = cat !== '전체' ? 'cursor: grab;' : 'cursor: pointer;';
            
            return `<button class="btn-memo-filter" data-filter="${cat}" ${draggableAttr} style="background: ${bg}; color: ${color}; ${border} ${shadow} padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; ${cursorStyle} transition: all 0.2s; user-select: none;">${cat}</button>`;
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
                    <button id="btn-add-memo" style="background:#0284c7; color:white; border:none; padding:8px 16px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2); transition: background 0.2s;">+ 새 칸 추가</button>
                </div>
                <div id="memo-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; width: 100%; align-items: start;"></div>
                
                <div id="tab-manager-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); z-index: 9999; justify-content: center; align-items: center;">
                    <div style="background: #ffffff; width: 420px; border-radius: 8px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px;">
                            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #1e293b;">⚙️ 탭 메뉴 관리</h3>
                            <span style="font-size: 11px; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 12px;">💡 항목을 드래그하여 순서 변경</span>
                        </div>
                        <div id="tab-manager-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; margin-bottom: 16px; padding-right: 4px;"></div>
                        <div style="display: flex; justify-content: space-between;">
                            <button id="btn-add-new-tab" style="background: #0ea5e9; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">+ 새 탭 추가</button>
                            <button id="btn-close-tab-manager" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">완료 / 닫기</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.renderMemos();
        this.bindTabDragAndDropEvents();
    },

    renderTabManagerList() {
        const listContainer = document.getElementById('tab-manager-list');
        if (!listContainer) return;
        listContainer.innerHTML = this.categories.map((cat) => `
            <div class="tab-list-item" data-category="${cat}" draggable="true" style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e0; padding: 8px 12px; border-radius: 4px; cursor: grab; transition: background 0.15s;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #94a3b8; font-size: 14px; cursor: grab; user-select: none;">☰</span>
                    <span style="font-size: 13px; font-weight: 700; color: #334155;">${cat}</span>
                </div>
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
                    if (this.categories.includes(newName.trim())) return alert("이미 존재하는 탭 이름입니다.");
                    const idx = this.categories.indexOf(oldName);
                    if (idx > -1) this.categories[idx] = newName.trim();
                    this.memos.forEach(m => { if (m.category === oldName) m.category = newName.trim(); });
                    if (this.currentFilter === oldName) this.currentFilter = newName.trim();
                    this.saveData(); this.renderLayout(); this.renderTabManagerList(); 
                    document.getElementById('tab-manager-modal').style.display = 'flex';
                }
            };
        });

        listContainer.querySelectorAll('.btn-delete-tab').forEach(btn => {
            btn.onclick = (e) => {
                if (this.categories.length <= 1) return alert("최소 1개의 탭 메뉴는 유지해야 합니다.");
                const oldName = e.target.getAttribute('data-old');
                if (confirm(`'${oldName}' 탭을 삭제하시겠습니까?\n해당 탭에 포함된 메모는 삭제되지 않으며, 다른 탭으로 자동 이동됩니다.`)) {
                    this.categories = this.categories.filter(c => c !== oldName);
                    const fallbackCategory = this.categories[0];
                    this.memos.forEach(m => { if (m.category === oldName) m.category = fallbackCategory; });
                    if (this.currentFilter === oldName) this.currentFilter = '기본';
                    this.saveData(); this.renderLayout(); this.renderTabManagerList();
                    document.getElementById('tab-manager-modal').style.display = 'flex';
                }
            };
        });

        this.bindTabDragAndDropEvents();
    },

    // 💡 개별 메모 칸(카드) 드래그 핸들(☰) 및 draggable 속성 추가 렌더링
    renderMemos() {
        const container = document.getElementById('memo-grid-container');
        if (!container) return;
        container.innerHTML = '';
        
        const filteredMemos = this.currentFilter === '전체' ? this.memos : this.memos.filter(m => m.category === this.currentFilter);
        
        filteredMemos.forEach(memo => {
            const card = document.createElement('div');
            card.className = "memo-card-item";
            card.setAttribute("data-memo-id", memo.id);
            card.setAttribute("draggable", "true"); // 💡 카드를 드래그 가능 요소로 지정
            card.style.cssText = "background: #ffffff; border: 1px solid #cbd5e0; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.03); width: 100%; box-sizing: border-box; transition: transform 0.15s, border 0.15s;";
            
            const categoryOptions = this.categories.map(cat => `<option value="${cat}" ${memo.category === cat ? 'selected' : ''}>${cat}</option>`).join('');
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px;">
                    <!-- 💡 카드 좌측 상단에 드래그 앤 드롭 전용 핸들 아이콘 배치 -->
                    <span class="memo-drag-handle" title="드래그하여 순서 변경" style="cursor: grab; color: #94a3b8; font-size: 16px; user-select: none; padding: 0 4px; display: flex; align-items: center;">☰</span>
                    <select class="memo-category-select" data-id="${memo.id}" style="flex: 1; border: 1px solid #cbd5e0; border-radius: 4px; padding: 6px; font-size: 12px; font-weight: 700; color: #334155; outline: none; background: #f8fafc; cursor: pointer;">${categoryOptions}</select>
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
        this.bindMemoDragAndDropEvents(); // 💡 메모 카드 드래그 이벤트 동적으로 바인딩
    },

    // 💡 탭 순서 변경 드래그 앤 드롭 전용 이벤트 바인딩
    bindTabDragAndDropEvents() {
        const self = this;
        
        const filterButtons = document.querySelectorAll('.btn-memo-filter[draggable="true"]');
        filterButtons.forEach(btn => {
            btn.ondragstart = (e) => {
                self.draggedCategory = e.target.getAttribute('data-filter');
                e.target.style.opacity = '0.4';
                e.dataTransfer.effectAllowed = 'move';
            };
            btn.ondragend = (e) => {
                e.target.style.opacity = '1';
                self.draggedCategory = null;
                filterButtons.forEach(b => b.style.transform = 'none');
            };
            btn.ondragover = (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const targetCat = e.target.getAttribute('data-filter');
                if (targetCat && targetCat !== '전체' && targetCat !== self.draggedCategory) {
                    e.target.style.transform = 'scale(1.08)';
                }
            };
            btn.ondragleave = (e) => {
                e.target.style.transform = 'none';
            };
            btn.ondrop = (e) => {
                e.preventDefault();
                e.target.style.transform = 'none';
                const targetCat = e.target.getAttribute('data-filter');
                if (targetCat && targetCat !== '전체' && self.draggedCategory) {
                    self.reorderCategories(self.draggedCategory, targetCat);
                }
            };
        });

        const listItems = document.querySelectorAll('.tab-list-item[draggable="true"]');
        listItems.forEach(item => {
            item.ondragstart = (e) => {
                self.draggedCategory = e.currentTarget.getAttribute('data-category');
                e.currentTarget.style.opacity = '0.4';
                e.currentTarget.style.background = '#e2e8f0';
                e.dataTransfer.effectAllowed = 'move';
            };
            item.ondragend = (e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.background = '#f8fafc';
                self.draggedCategory = null;
                listItems.forEach(i => i.style.borderTop = '1px solid #cbd5e0');
            };
            item.ondragover = (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const targetCat = e.currentTarget.getAttribute('data-category');
                if (targetCat && targetCat !== self.draggedCategory) {
                    e.currentTarget.style.borderTop = '2px solid #0ea5e9';
                }
            };
            item.ondragleave = (e) => {
                e.currentTarget.style.borderTop = '1px solid #cbd5e0';
            };
            item.ondrop = (e) => {
                e.preventDefault();
                e.currentTarget.style.borderTop = '1px solid #cbd5e0';
                const targetCat = e.currentTarget.getAttribute('data-category');
                if (targetCat && self.draggedCategory) {
                    self.reorderCategories(self.draggedCategory, targetCat);
                }
            };
        });
    },

    // 💡 메모 칸(카드) 순서 변경 드래그 앤 드롭 전용 이벤트 바인딩
    bindMemoDragAndDropEvents() {
        const self = this;
        const memoCards = document.querySelectorAll('.memo-card-item[draggable="true"]');
        
        memoCards.forEach(card => {
            card.ondragstart = (e) => {
                // 💡 Red Teaming 방어: 텍스트 편집, 선택 박스, 버튼 클릭 시 카드 드래그 강제 차단
                if (['TEXTAREA', 'SELECT', 'BUTTON', 'OPTION'].includes(e.target.tagName)) {
                    e.preventDefault();
                    return false;
                }
                self.draggedMemoId = parseInt(e.currentTarget.getAttribute('data-memo-id'));
                e.currentTarget.style.opacity = '0.4';
                e.dataTransfer.effectAllowed = 'move';
            };
            card.ondragend = (e) => {
                e.currentTarget.style.opacity = '1';
                self.draggedMemoId = null;
                memoCards.forEach(c => {
                    c.style.border = '1px solid #cbd5e0';
                    c.style.background = '#ffffff';
                });
            };
            card.ondragover = (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const targetId = parseInt(e.currentTarget.getAttribute('data-memo-id'));
                if (targetId && targetId !== self.draggedMemoId) {
                    e.currentTarget.style.border = '2px dashed #0284c7';
                    e.currentTarget.style.background = '#f0f9ff'; // 드랍 위치 직관적 피드백
                }
            };
            card.ondragleave = (e) => {
                e.currentTarget.style.border = '1px solid #cbd5e0';
                e.currentTarget.style.background = '#ffffff';
            };
            card.ondrop = (e) => {
                e.preventDefault();
                e.currentTarget.style.border = '1px solid #cbd5e0';
                e.currentTarget.style.background = '#ffffff';
                const targetId = parseInt(e.currentTarget.getAttribute('data-memo-id'));
                if (targetId && self.draggedMemoId) {
                    self.reorderMemos(self.draggedMemoId, targetId);
                }
            };
        });
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
            if (e.target.id === 'btn-close-tab-manager') document.getElementById('tab-manager-modal').style.display = 'none';
            if (e.target.id === 'btn-add-new-tab') {
                const newTabName = prompt("추가할 새 탭 메뉴의 이름을 입력하세요:");
                if (newTabName && newTabName.trim() !== '') {
                    if (this.categories.includes(newTabName.trim())) return alert("이미 존재하는 탭 이름입니다.");
                    this.categories.push(newTabName.trim());
                    this.saveData(); this.renderLayout(); this.renderTabManagerList(); 
                    document.getElementById('tab-manager-modal').style.display = 'flex';
                }
            }
            if (e.target.id === 'btn-add-memo') {
                const newCategory = this.currentFilter === '전체' ? this.categories[0] : this.currentFilter;
                this.memos.push({ id: Date.now(), title: "", content: "", category: newCategory });
                this.saveData(); this.renderMemos();
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
                this.saveData(); this.renderMemos();
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
                        if (window.QA_CORE.UI && typeof window.QA_CORE.UI.showToast === 'function') window.QA_CORE.UI.showToast(`✅ [${memo.category}] 탭으로 이동`);
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
                if (memo && memo.content) navigator.clipboard.writeText(memo.content).then(() => alert("✅ 클립보드에 복사되었습니다.")).catch(() => alert("복사 실패"));
            };
        });

        container.querySelectorAll('.btn-delete-memo').forEach(btn => {
            btn.onclick = (e) => {
                if(confirm("해당 메모를 삭제하시겠습니까?")) {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    this.memos = this.memos.filter(m => m.id !== id);
                    this.saveData(); this.renderMemos();
                }
            };
        });
    }
};

export function initTemplatePanel() {
    window.QA_CORE.Template.Manager.init();
}
