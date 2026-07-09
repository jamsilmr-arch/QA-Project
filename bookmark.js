window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Bookmark = window.QA_CORE.Bookmark || {};

window.QA_CORE.Bookmark.Manager = {
    state: {
        folders: {}, // { folderId: { name: "폴더명", parentId: null } }
        items: [],   // [ { id: 1, title: "이름", url: "주소", folderId: "폴더ID" } ]
        selectedFolderId: null
    },

    init() {
        this.loadLocalData();
        this.connectFirebaseContext();
        this.renderFolderTree();
        this.bindEventsGlobal();
    },

    loadLocalData() {
        const localFolders = localStorage.getItem('QA_SYSTEM_BM_FOLDERS');
        const localItems = localStorage.getItem('QA_SYSTEM_BM_ITEMS');
        if (localFolders) this.state.folders = JSON.parse(localFolders);
        if (localItems) this.state.items = JSON.parse(localItems);

        // 최초 마운트 시 기본 폴더 가드 수립
        if (Object.keys(this.state.folders).length === 0) {
            this.state.folders = {
                'root_default': { name: "📁 기본 북마크", parentId: null }
            };
        }
    },

    connectFirebaseContext() {
        if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Schedule && window.QA_CORE.Calendar.Schedule.db) {
            this.db = window.QA_CORE.Calendar.Schedule.db;
            // 파이어베이스 원격 동기화 리스너 바인딩
            this.db.ref('bookmark_folders').on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    this.state.folders = data;
                    this.renderFolderTree();
                }
            });
        }
    },

    /**
     * [고도화] 폴더명 수정 인라인 에디터가 내장된 동적 트리 렌더러입니다.
     */
    renderFolderTree() {
        const treeZone = document.getElementById('bookmark-folder-tree-zone') || 
                           document.querySelector('.bookmark-sidebar .tree-container');
        if (!treeZone) return;
        treeZone.innerHTML = '';

        Object.keys(this.state.folders).forEach(folderId => {
            const folder = this.state.folders[folderId];
            
            const folderLi = document.createElement('li');
            folderLi.className = `folder-tree-node ${this.state.selectedFolderId === folderId ? 'active' : ''}`;
            folderLi.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:6px 10px; margin:4px 0; border-radius:6px; cursor:pointer; font-size:13px; transition:background 0.2s;';
            folderLi.setAttribute('data-folder-id', folderId);

            // 명세 구역 래퍼 (이름 출력 레이어)
            const labelSpan = document.createElement('span');
            labelSpan.className = 'folder-label-text';
            labelSpan.innerText = folder.name;
            labelSpan.style.cssText = 'flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
            
            // 더블클릭 격발 시 즉시 인라인 수정 모드로 전환 가동
            labelSpan.ondblclick = (e) => {
                e.stopPropagation();
                this.activateInlineFolderEditor(folderId, labelSpan);
            };

            // 액션 제어 단추 그룹
            const actionGroup = document.createElement('div');
            actionGroup.className = 'folder-actions-hidden';
            actionGroup.style.cssText = 'display:flex; gap:4px;';

            // 📝 수정 단추 주입
            const editBtn = document.createElement('button');
            editBtn.innerText = '📝';
            editBtn.style.cssText = 'background:none; border:none; cursor:pointer; font-size:11px; padding:2px;';
            editBtn.title = "폴더명 수정";
            editBtn.onclick = (e) => {
                e.stopPropagation();
                this.activateInlineFolderEditor(folderId, labelSpan);
            };

            const delBtn = document.createElement('button');
            delBtn.innerText = '🗑️';
            delBtn.style.cssText = 'background:none; border:none; cursor:pointer; font-size:11px; padding:2px;';
            delBtn.onclick = (e) => {
                e.stopPropagation();
                this.executeFolderDeletion(folderId);
            };

            actionGroup.appendChild(editBtn);
            if (folderId !== 'root_default') actionGroup.appendChild(delBtn);

            folderLi.appendChild(labelSpan);
            folderLi.appendChild(actionGroup);

            // 클릭 시 해당 폴더 선택 및 아이템 필터링 엔진 격발
            folderLi.onclick = () => {
                this.state.selectedFolderId = folderId;
                this.renderFolderTree();
                this.renderBookmarkItems();
            };

            treeZone.appendChild(folderLi);
        });
    },

    /**
     * [신규 파이프라인] 더블클릭 또는 수정 버튼 클릭 시 인라인 input 박스로 스왑하는 제어 엔진입니다.
     */
    activateInlineFolderEditor(folderId, labelElement) {
        const currentName = this.state.folders[folderId].name;
        
        const inputEdit = document.createElement('input');
        inputEdit.type = 'text';
        inputEdit.value = currentName;
        inputEdit.style.cssText = 'width: 85%; padding: 2px 6px; border: 1px solid #3182ce; border-radius: 4px; font-size: 13px; outline: none; background:#fff; color:#000;';
        
        // 부모 노드 텍스트를 입력창으로 교체 치환
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
                // 1. 메모리 상태 구조체 인덱스 최신화
                this.state.folders[folderId].name = newName;
                
                // 2. 브라우저 영속성 스토리지 즉시 동기화 반영
                localStorage.setItem('QA_SYSTEM_BM_FOLDERS', JSON.stringify(this.state.folders));
                
                // 3. Firebase 원격 실시간 스트림 푸시 가드 격발
                if (this.db) {
                    this.db.ref('bookmark_folders/' + folderId).update({ name: newName });
                }
            }
            this.renderFolderTree(); // 재렌더링을 통한 무결성 노드 롤백 복구
        };

        // 포커스를 잃거나 엔터키 입력 시 수정 내역 저장 확정 파이프라인 작동
        inputEdit.onblur = saveRoutine;
        inputEdit.onkeydown = (e) => {
            if (e.key === 'Enter') saveRoutine();
            if (e.key === 'Escape') { isSaved = true; this.renderFolderTree(); } // ESC 입력 시 변경 취소 가드
        };
    },

    executeFolderDeletion(folderId) {
        if (folderId === 'root_default') return;
        if (!confirm("해당 폴더를 완전히 삭제하시겠습니까?\n폴더 안의 북마크 링크 자산은 기본 폴더로 자동 이관됩니다.")) return;

        // 삭제 대상 폴더 내 북마크 링크 구출용 복구 가드 기동
        this.state.items.forEach(item => {
            if (item.folderId === folderId) {
                item.folderId = 'root_default';
            }
        });

        delete this.state.folders[folderId];

        localStorage.setItem('QA_SYSTEM_BM_FOLDERS', JSON.stringify(this.state.folders));
        localStorage.setItem('QA_SYSTEM_BM_ITEMS', JSON.stringify(this.state.items));

        if (this.db) {
            this.db.ref('bookmark_folders').set(this.state.folders);
            this.db.ref('bookmark_items').set(this.state.items);
        }

        if (this.state.selectedFolderId === folderId) {
            this.state.selectedFolderId = 'root_default';
        }

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
            itemZone.innerHTML = `<div style="grid-column:1/-1; padding:40px; text-align:center; color:#a0aec0; font-size:13px;">본 폴더에 등록된 북마크 링크가 없습니다.</div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bookmark-link-card';
            card.style.cssText = 'background:#fff; border:1px solid #e2e8f0; padding:14px; border-radius:8px; display:flex; flex-direction:column; justify-content:space-between; position:relative;';
            card.innerHTML = `
                <div style="font-weight:600; font-size:13px; color:#1a202c; margin-bottom:6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.title}</div>
                <div style="font-size:11px; color:#718096; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:12px;">${item.url}</div>
                <div style="display:flex; justify-content:flex-end; gap:6px;">
                    <a href="${item.url}" target="_blank" style="text-decoration:none; background:#edf2f7; color:#2b6cb0; font-size:11px; padding:4px 8px; border-radius:4px; font-weight:600;">이동</a>
                    <button class="btn-bm-item-del" data-id="${item.id}" style="background:none; border:none; color:#e53e3e; cursor:pointer; font-size:11px;">삭제</button>
                </div>
            `;
            
            card.querySelector('.btn-bm-item-del').onclick = () => {
                if(confirm("이 북마크를 삭제하시겠습니까?")) {
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
                const name = prompt("새로 개설할 북마크 폴더명을 입력하세요:");
                if (!name || !name.trim()) return;

                const newId = 'fold_' + Date.now();
                this.state.folders[newId] = {
                    name: name.trim(),
                    parentId: null
                };

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