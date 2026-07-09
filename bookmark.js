window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Bookmark = window.QA_CORE.Bookmark || {};

// 정적 호환성을 위해 전역 window 스코프에 마크업 뼈대 템플릿 마운트
window.QA_CORE.Bookmark.TEMPLATE = `
    <div class="bookmark-main-container" style="display: flex; gap: 24px; width: 100%; height: calc(100vh - 160px); min-height: 550px; padding: 4px; box-sizing: border-box;">
        <div class="bookmark-sidebar" style="flex: 0.8; min-width: 240px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 18px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; margin: 0; display: flex; align-items: center; gap: 6px;">📁 폴더 관리</h3>
                <button id="btn-bookmark-add-folder" style="background: #3182ce; color: white; border: none; padding: 4px 10px; font-size: 11px; font-weight: 600; border-radius: 6px; cursor: pointer;">➕ 새 폴더</button>
            </div>
            <hr style="border: none; border-top: 1px solid #edf2f7; margin: 0;">
            <ul id="bookmark-folder-tree-zone" style="list-style: none; padding: 0; margin: 0; overflow-y: auto; flex: 1;"></ul>
        </div>
        <div class="bookmark-content-zone" style="flex: 2.2; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 18px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #1a202c; margin: 0;">🔗 등록된 북마크 링크</h2>
                <div style="font-size: 11px; color: #718096;">💡 폴더명 더블클릭 또는 📝 버튼으로 수정 가능</div>
            </div>
            <div id="bookmark-items-grid-zone" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; overflow-y: auto; flex: 1; align-content: start;"></div>
        </div>
    </div>
`;

window.QA_CORE.Bookmark.Manager = {
    state: { folders: {}, items: [], selectedFolderId: null },

    init() {
        // [화이트아웃 정류 가드] 빈 판넬 엘리먼트에 HTML 템플릿 뼈대를 선제 주입하여 DOM 누락 차단
        const panelZone = document.getElementById('tab-panel-bookmark') || document.getElementById('tab-panel-bm');
        if (panelZone) {
            panelZone.innerHTML = window.QA_CORE.Bookmark.TEMPLATE;
        }
        this.loadLocalData();
        this.connectFirebaseContext();
        this.renderFolderTree();
        this.renderBookmarkItems();
        this.bindEventsGlobal();
    },

    loadLocalData() {
        const localFolders = localStorage.getItem('QA_SYSTEM_BM_FOLDERS');
        const localItems = localStorage.getItem('QA_SYSTEM_BM_ITEMS');
        if (localFolders) this.state.folders = JSON.parse(localFolders);
        if (localItems) this.state.items = JSON.parse(localItems);

        if (Object.keys(this.state.folders).length === 0) {
            this.state.folders = { 'root_default': { name: "📁 기본 북마크", parentId: null } };
        }
        if (!this.state.selectedFolderId) this.state.selectedFolderId = 'root_default';
    },

    connectFirebaseContext() {
        if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Schedule && window.QA_CORE.Calendar.Schedule.db) {
            this.db = window.QA_CORE.Calendar.Schedule.db;
            this.db.ref('bookmark_folders').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) { this.state.folders = data; this.renderFolderTree(); }
            });
            this.db.ref('bookmark_items').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) { this.state.items = data; this.renderBookmarkItems(); }
            });
        }
    },

    renderFolderTree() {
        const treeZone = document.getElementById('bookmark-folder-tree-zone');
        if (!treeZone) return;
        treeZone.innerHTML = '';

        Object.keys(this.state.folders).forEach(folderId => {
            const folder = this.state.folders[folderId];
            const isActive = this.state.selectedFolderId === folderId;
            
            const folderLi = document.createElement('li');
            folderLi.style.cssText = `display:flex; align-items:center; justify-content:space-between; padding:8px 12px; margin:4px 0; border-radius:8px; cursor:pointer; font-size:13px; background:${isActive ? '#ebf8ff' : 'transparent'}; color:${isActive ? '#2b6cb0' : '#4a5568'}; font-weight:${isActive ? '700' : '500'};`;
            
            const labelSpan = document.createElement('span');
            labelSpan.innerText = folder.name;
            labelSpan.style.cssText = 'flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
            labelSpan.ondblclick = (e) => { e.stopPropagation(); this.activateInlineFolderEditor(folderId, labelSpan); };

            const actionGroup = document.createElement('div');
            actionGroup.style.cssText = 'display:flex; gap:6px;';

            const editBtn = document.createElement('button');
            editBtn.innerText = '📝';
            editBtn.style.cssText = 'background:none; border:none; cursor:pointer; font-size:11px;';
            editBtn.onclick = (e) => { e.stopPropagation(); this.activateInlineFolderEditor(folderId, labelSpan); };

            const delBtn = document.createElement('button');
            delBtn.innerText = '🗑️';
            delBtn.style.cssText = 'background:none; border:none; color:#e53e3e; cursor:pointer; font-size:11px;';
            delBtn.onclick = (e) => { e.stopPropagation(); this.executeFolderDeletion(folderId); };

            actionGroup.appendChild(editBtn);
            if (folderId !== 'root_default') actionGroup.appendChild(delBtn);

            folderLi.appendChild(labelSpan);
            folderLi.appendChild(actionGroup);

            folderLi.onclick = () => {
                this.state.selectedFolderId = folderId;
                this.renderFolderTree();
                this.renderBookmarkItems();
            };
            treeZone.appendChild(folderLi);
        });
    },

    activateInlineFolderEditor(folderId, labelElement) {
        const currentName = this.state.folders[folderId].name;
        const inputEdit = document.createElement('input');
        inputEdit.type = 'text';
        inputEdit.value = currentName;
        inputEdit.style.cssText = 'width: 90%; padding: 4px 8px; border: 1px solid #3182ce; border-radius: 6px; font-size: 12px; outline: none;';
        
        const parentNode = labelElement.parentNode;
        parentNode.replaceChild(inputEdit, labelElement);
        inputEdit.focus();
        inputEdit.select();

        let isSaved = false;
        const saveRoutine = () => {
            if (isSaved) return;
            isSaved = true;
            const newName = inputEdit.value.trim();
            if (newName && newName !== currentName) {
                this.state.folders[folderId].name = newName;
                localStorage.setItem('QA_SYSTEM_BM_FOLDERS', JSON.stringify(this.state.folders));
                if (this.db) this.db.ref('bookmark_folders/' + folderId).update({ name: newName });
            }
            this.renderFolderTree();
        };

        inputEdit.onblur = saveRoutine;
        inputEdit.onkeydown = (e) => { if (e.key === 'Enter') saveRoutine(); if (e.key === 'Escape') { isSaved = true; this.renderFolderTree(); } };
    },

    executeFolderDeletion(folderId) {
        if (folderId === 'root_default') return;
        if (!confirm("폴더를 삭제하시겠습니까? 내부 링크는 기본 폴더로 복구 이관됩니다.")) return;
        this.state.items.forEach(item => { if (item.folderId === folderId) item.folderId = 'root_default'; });
        delete this.state.folders[folderId];
        localStorage.setItem('QA_SYSTEM_BM_FOLDERS', JSON.stringify(this.state.folders));
        localStorage.setItem('QA_SYSTEM_BM_ITEMS', JSON.stringify(this.state.items));
        if (this.db) { this.db.ref('bookmark_folders').set(this.state.folders); this.db.ref('bookmark_items').set(this.state.items); }
        if (this.state.selectedFolderId === folderId) this.state.selectedFolderId = 'root_default';
        this.renderFolderTree();
        this.renderBookmarkItems();
    },

    renderBookmarkItems() {
        const itemZone = document.getElementById('bookmark-items-grid-zone');
        if (!itemZone) return;
        itemZone.innerHTML = '';

        const targetFolder = this.state.selectedFolderId || 'root_default';
        const filtered = this.state.items.filter(item => item.folderId === targetFolder);

        if (filtered.length === 0) {
            itemZone.innerHTML = `<div style="grid-column:1/-1; padding:40px 0; text-align:center; color:#a0aec0; font-size:13px;">등록된 북마크 링크가 없습니다.</div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.style.cssText = 'background:#ffffff; border:1px solid #e2e8f0; padding:16px; border-radius:10px; display:flex; flex-direction:column; justify-content:space-between; min-height:100px; box-shadow:0 2px 4px rgba(0,0,0,0.01);';
            card.innerHTML = `
                <div>
                    <div style="font-weight:600; font-size:13px; color:#1a202c; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.title}</div>
                    <div style="font-size:11px; color:#a0aec0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:12px;">${item.url}</div>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px;">
                    <a href="${item.url}" target="_blank" style="text-decoration:none; background:#ebf8ff; color:#2b6cb0; font-size:11px; padding:5px 10px; border-radius:6px; font-weight:700;">이동 🚀</a>
                    <button class="btn-bm-item-del" style="background:none; border:none; color:#e53e3e; cursor:pointer; font-size:11px;">삭제</button>
                </div>
            `;
            card.querySelector('.btn-bm-item-del').onclick = () => {
                if(confirm("북마크를 삭제하시겠습니까?")) {
                    this.state.items = this.state.items.filter(i => i.id !== item.id);
                    localStorage.setItem('QA_SYSTEM_BM_ITEMS', JSON.stringify(this.state.items));
                    if (this.db) this.db.ref('bookmark_items').set(this.state.items);
                    this.renderBookmarkItems();
                }
            };
            itemZone.appendChild(card);
        });
    },

    bindEventsGlobal() {
        const addFolderBtn = document.getElementById('btn-bookmark-add-folder');
        if (addFolderBtn) {
            addFolderBtn.onclick = () => {
                const name = prompt("새 북마크 폴더명을 입력하세요:");
                if (!name || !name.trim()) return;
                const newId = 'fold_' + Date.now();
                this.state.folders[newId] = { name: name.trim(), parentId: null };
                localStorage.setItem('QA_SYSTEM_BM_FOLDERS', JSON.stringify(this.state.folders));
                if (this.db) this.db.ref('bookmark_folders/' + newId).set(this.state.folders[newId]);
                this.renderFolderTree();
            };
        }
    }
};

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('BookmarkModuleCore', window.QA_CORE.Bookmark.Manager);
}