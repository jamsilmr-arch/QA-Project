window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Bookmark = window.QA_CORE.Bookmark || {};

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

        <div class="bookmark-content-zone" style="flex: 2.2; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 18px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #1a202c; margin: 0;">🔗 등록된 북마크 링크</h2>
                <div style="font-size: 11px; color: #718096;">💡 폴더명 혹은 북마크 카드의 수정 단추를 통해 실시간 편집이 가능합니다.</div>
            </div>

            <div id="bookmark-registration-form" style="display: flex; gap: 10px; background: #f7fafc; padding: 12px; border-radius: 8px; border: 1px solid #edf2f7; align-items: center;">
                <input type="text" id="input-bm-title" placeholder="북마크 제목 입력" style="flex: 1; padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; outline: none; background: #fff; color: #000;">
                <input type="text" id="input-bm-url" placeholder="URL 주소 입력 (example.com)" style="flex: 1.5; padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; outline: none; background: #fff; color: #000;">
                <select id="select-bm-folder" style="flex: 1; padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; outline: none; background: #fff; color: #000; cursor: pointer; font-weight: 600;"></select>
                <button id="btn-bookmark-add-item" style="background: #3182ce; color: white; border: none; padding: 6px 16px; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: pointer; white-space: nowrap;">➕ 링크 추가</button>
            </div>

            <div id="bookmark-items-grid-zone" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; overflow-y: auto; flex: 1; align-content: start; margin-top: 8px;"></div>
        </div>

    </div>
`;

window.QA_CORE.Bookmark.Manager = {
    state: { folders: {}, items: [], selectedFolderId: null },

    init() {
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
                if (data) { 
                    this.state.folders = data; 
                    localStorage.setItem('QA_SYSTEM_BM_FOLDERS', JSON.stringify(data));
                    this.renderFolderTree(); 
                }
            });
            this.db.ref('bookmark_items').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) { 
                    this.state.items = data; 
                    localStorage.setItem('QA_SYSTEM_BM_ITEMS', JSON.stringify(data));
                    this.renderBookmarkItems(); 
                }
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
            
            let folderDisplayName = folder.name;
            if (!folderDisplayName.startsWith('📁')) {
                folderDisplayName = '📁 ' + folderDisplayName;
            }

            const folderLi = document.createElement('li');
            folderLi.style.cssText = `display:flex; align-items:center; justify-content:space-between; padding:8px 12px; margin:4px 0; border-radius:8px; cursor:pointer; font-size:13px; transition:all 0.2s ease; background:${isActive ? '#ebf8ff' : '#f8fafc'}; border:1px solid ${isActive ? '#bee3f8' : '#e2e8f0'}; color:${isActive ? '#2b6cb0' : '#4a5568'}; font-weight:${isActive ? '700' : '500'};`;
            
            const labelSpan = document.createElement('span');
            labelSpan.innerText = folderDisplayName;
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
            actionGroup.appendChild(delBtn);

            folderLi.appendChild(labelSpan);
            folderLi.appendChild(actionGroup);

            folderLi.onclick = () => {
                this.state.selectedFolderId = folderId;
                this.renderFolderTree();
                this.renderBookmarkItems();
            };
            treeZone.appendChild(folderLi);
        });

        this.updateFolderDropdown();
    },

    updateFolderDropdown() {
        const selectElement = document.getElementById('select-bm-folder');
        if (!selectElement) return;
        
        const currentSelection = selectElement.value || this.state.selectedFolderId || 'root_default';
        selectElement.innerHTML = '';

        Object.keys(this.state.folders).forEach(folderId => {
            const folder = this.state.folders[folderId];
            let folderDisplayName = folder.name;
            if (!folderDisplayName.startsWith('📁')) {
                folderDisplayName = '📁 ' + folderDisplayName;
            }
            
            const option = document.createElement('option');
            option.value = folderId;
            option.innerText = folderDisplayName;
            if (folderId === currentSelection) option.selected = true;
            selectElement.appendChild(option);
        });
    },

    activateInlineFolderEditor(folderId, labelElement) {
        let currentName = this.state.folders[folderId].name;
        if (currentName.startsWith('📁')) currentName = currentName.replace(/^📁\s*/, '');
        
        const inputEdit = document.createElement('input');
        inputEdit.type = 'text';
        inputEdit.value = currentName;
        inputEdit.style.cssText = 'width: 90%; padding: 4px 8px; border: 1px solid #3182ce; border-radius: 6px; font-size: 12px; outline: none; background:#fff; color:#000;';
        
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
                this.state.folders[folderId].name = '📁 ' + newName;
                localStorage.setItem('QA_SYSTEM_BM_FOLDERS', JSON.stringify(this.state.folders));
                if (this.db) this.db.ref('bookmark_folders/' + folderId).update({ name: '📁 ' + newName });
            }
            this.renderFolderTree();
        };

        inputEdit.onblur = saveRoutine;
        inputEdit.onkeydown = (e) => { if (e.key === 'Enter') saveRoutine(); if (e.key === 'Escape') { isSaved = true; this.renderFolderTree(); } };
    },

    executeFolderDeletion(folderId) {
        if (!confirm("해당 폴더를 완전히 삭제하시겠습니까?\n폴더 안의 북마크 링크 자산은 안전하게 다른 자동 이관 폴더로 통합됩니다.")) return;

        const folderKeys = Object.keys(this.state.folders);
        let fallbackFolderId = folderKeys.find(key => key !== folderId) || 'root_default';

        if (folderKeys.length <= 1) {
            fallbackFolderId = 'root_default';
            this.state.folders['root_default'] = { name: "📁 기본 북마크", parentId: null };
        }

        this.state.items.forEach(item => {
            if (item.folderId === folderId) item.folderId = fallbackFolderId;
        });

        if (folderId !== 'root_default' || folderKeys.length > 1) {
            delete this.state.folders[folderId];
        }

        localStorage.setItem('QA_SYSTEM_BM_FOLDERS', JSON.stringify(this.state.folders));
        localStorage.setItem('QA_SYSTEM_BM_ITEMS', JSON.stringify(this.state.items));

        if (this.db) {
            this.db.ref('bookmark_folders').set(this.state.folders);
            this.db.ref('bookmark_items').set(this.state.items);
        }

        if (this.state.selectedFolderId === folderId) {
            this.state.selectedFolderId = fallbackFolderId;
        }

        this.renderFolderTree();
        this.renderBookmarkItems();
    },

    /**
     * [핵심 기능 리팩토링] 개별 등록 북마크 카드별 인라인 수정 인터페이스 모듈 전면 장착
     */
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
            card.style.cssText = 'background:#ffffff; border:1px solid #e2e8f0; padding:16px; border-radius:10px; display:flex; flex-direction:column; justify-content:space-between; min-height:110px; box-shadow:0 2px 4px rgba(0,0,0,0.01); transition:all 0.2s ease;';
            
            // 개별 컴포넌트 단위 인라인 에디팅 토글 상태 정의
            let isEditing = false;

            const renderCardContent = () => {
                card.innerHTML = '';
                if (!isEditing) {
                    // 일반 모드: 정보 열람 및 이동/수정/삭제 단추 노출
                    card.innerHTML = `
                        <div>
                            <div style="font-weight:600; font-size:13px; color:#1a202c; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${item.title}">${item.title}</div>
                            <div style="font-size:11px; color:#a0aec0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:12px;" title="${item.url}">${item.url}</div>
                        </div>
                        <div style="display:flex; justify-content:flex-end; gap:8px; align-items:center;">
                            <a href="${item.url}" target="_blank" style="text-decoration:none; background:#ebf8ff; color:#2b6cb0; font-size:11px; padding:5px 10px; border-radius:6px; font-weight:700;">이동 🚀</a>
                            <button class="btn-bm-item-edit" style="background:none; border:none; color:#3182ce; cursor:pointer; font-size:11px; font-weight:600;">수정 📝</button>
                            <button class="btn-bm-item-del" style="background:none; border:none; color:#e53e3e; cursor:pointer; font-size:11px; font-weight:600;">삭제</button>
                        </div>
                    `;
                    
                    card.querySelector('.btn-bm-item-edit').onclick = () => {
                        isEditing = true;
                        renderCardContent(); // 인라인 입력창 폼으로 즉시 치환 스왑
                    };
                    
                    card.querySelector('.btn-bm-item-del').onclick = () => {
                        if(confirm("북마크를 삭제하시겠습니까?")) {
                            this.state.items = this.state.items.filter(i => i.id !== item.id);
                            localStorage.setItem('QA_SYSTEM_BM_ITEMS', JSON.stringify(this.state.items));
                            if (this.db) this.db.ref('bookmark_items').set(this.state.items);
                            this.renderBookmarkItems();
                        }
                    };
                } else {
                    // 수정 가동 모드: 변경 타이틀 및 URL 수집을 위한 input 박스 임베딩
                    card.innerHTML = `
                        <div style="display:flex; flex-direction:column; gap:6px; width:100%;">
                            <input type="text" class="input-edit-title" value="${item.title}" placeholder="북마크 제목" style="width:100%; padding:4px 8px; border:1px solid #3182ce; border-radius:6px; font-size:12px; box-sizing:border-box; background:#fff; color:#000; outline:none;">
                            <input type="text" class="input-edit-url" value="${item.url}" placeholder="URL 주소" style="width:100%; padding:4px 8px; border:1px solid #3182ce; border-radius:6px; font-size:11px; box-sizing:border-box; background:#fff; color:#000; outline:none; margin-bottom:4px;">
                        </div>
                        <div style="display:flex; justify-content:flex-end; gap:6px; align-items:center;">
                            <button class="btn-bm-item-save" style="background:#3182ce; color:white; border:none; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer;">저장</button>
                            <button class="btn-bm-item-cancel" style="background:#edf2f7; color:#4a5568; border:none; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer;">취소</button>
                        </div>
                    `;

                    const titleInput = card.querySelector('.input-edit-title');
                    const urlInput = card.querySelector('.input-edit-url');

                    // 변경 데이터 영속성 트랙 확정 연산자
                    card.querySelector('.btn-bm-item-save').onclick = () => {
                        const newTitle = titleInput.value.trim();
                        let newUrl = urlInput.value.trim();

                        if (!newTitle || !newUrl) {
                            alert("북마크 제목과 URL을 누락 없이 입력해주십시오.");
                            return;
                        }

                        // [안전가드] 프로토콜 유실 오기입 시 상대경로 404 크래시 자동 교정 방어막
                        if (!/^https?:\/\//i.test(newUrl)) {
                            newUrl = 'https://' + newUrl;
                        }

                        // 전역 상태 계보 동기 갱신
                        item.title = newTitle;
                        item.url = newUrl;

                        localStorage.setItem('QA_SYSTEM_BM_ITEMS', JSON.stringify(this.state.items));
                        if (this.db) this.db.ref('bookmark_items').set(this.state.items);

                        isEditing = false;
                        this.renderBookmarkItems();
                    };

                    card.querySelector('.btn-bm-item-cancel').onclick = () => {
                        isEditing = false;
                        renderCardContent(); // 변경 취소 시 원래 뷰 노드로 컴포넌트 롤백
                    };
                }
            };

            renderCardContent();
            itemZone.appendChild(card);
        });
    },

    bindEventsGlobal() {
        const addFolderBtn = document.getElementById('btn-bookmark-add-folder');
        if (addFolderBtn) {
            addFolderBtn.onclick = () => {
                const name = prompt("새로 개설할 북마크 폴더명을 입력하세요:");
                if (!name || !name.trim()) return;

                const newId = 'fold_' + Date.now();
                let formattedName = name.trim();
                if(!formattedName.startsWith('📁')) formattedName = '📁 ' + formattedName;

                this.state.folders[newId] = { name: formattedName, parentId: null };

                localStorage.setItem('QA_SYSTEM_BM_FOLDERS', JSON.stringify(this.state.folders));
                if (this.db) this.db.ref('bookmark_folders/' + newId).set(this.state.folders[newId]);

                this.renderFolderTree();
            };
        }

        const addItemBtn = document.getElementById('btn-bookmark-add-item');
        if (addItemBtn) {
            addItemBtn.onclick = () => {
                const titleInput = document.getElementById('input-bm-title');
                const urlInput = document.getElementById('input-bm-url');
                const folderSelect = document.getElementById('select-bm-folder');
                if (!titleInput || !urlInput || !folderSelect) return;

                const title = titleInput.value.trim();
                let url = urlInput.value.trim();
                const targetFolderId = folderSelect.value || this.state.selectedFolderId || 'root_default';

                if (!title || !url) { alert("북마크 제목과 URL 주소를 모두 정밀히 입력하십시오."); return; }

                if (!/^https?:\/\//i.test(url)) {
                    url = 'https://' + url;
                }

                const newItem = {
                    id: Date.now(),
                    title: title,
                    url: url,
                    folderId: targetFolderId
                };

                this.state.items.push(newItem);

                localStorage.setItem('QA_SYSTEM_BM_ITEMS', JSON.stringify(this.state.items));
                if (this.db) this.db.ref('bookmark_items').set(this.state.items);

                titleInput.value = '';
                urlInput.value = '';
                this.renderBookmarkItems();
            };
        }
    }
};

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('BookmarkModuleCore', window.QA_CORE.Bookmark.Manager);
}