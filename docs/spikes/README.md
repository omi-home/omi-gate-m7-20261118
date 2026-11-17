# Báo cáo Spike Phase 0 — Mục lục & Bảng quyết định

Ngày chạy: 2026-11-17 · Người thực hiện: phiên Coordinator chính (ngoại lệ bootstrap Phase 0: chưa có OMI Project/Issue; các spike này phải được bổ sung thành Spike Issue khi tích hợp GitHub chính thức được thiết lập).

## Môi trường (quan sát thực tế)

| Công cụ | Quan sát |
| --- | --- |
| Hệ điều hành | Windows 11 Home 10.0.26200, Git Bash + PowerShell 5.1 |
| Claude Code | `2.1.325 (Claude Code)` (`claude --version`) |
| Git | `git version 2.55.0.windows.5` |
| gh | `gh version 2.100.0 (2026-09-03)` |
| Node / npm | `v24.22.2` / `11.19.1` |
| Xác thực GitHub | `gh auth status`: tài khoản `minibox-claude-code` (keyring), scope `gist, project, read:org, repo, workflow` — **không có `delete_repo`** |
| Org dùng để test | `omi-home`: gói **Free**, tài khoản là `member` (được tạo repo public/private), Issue Type có sẵn `Task, Bug, Feature` |
| Native workflow | Lần 1: không có tool `Workflow`. Sau khi bật "Dynamic workflows" (`"enableWorkflows": true` trong `~/.claude/settings.json`): có tool `Workflow` — **chỉ khi nạp user settings** |

## Fixture đã tạo (dùng một lần, an toàn để xóa)

| Loại | Tài nguyên | Trạng thái để lại |
| --- | --- | --- |
| Cục bộ | plugin `omi-spike`, bare `origin.git` + clone + worktree, clone repo public | trong scratchpad của phiên (có thể bị xóa) |
| Repo public | <https://github.com/omi-home/omi-spike-p0-20261117> | default `develop`; classic protection trên `develop`; issue #1–#10, PR #6/#8 merged, PR #10 mở; branch `feature/*` còn trên remote |
| Repo private | <https://github.com/omi-home/omi-spike-p0-private-20261117> | commit `direct-push.txt` trên `develop` |
| Project | <https://github.com/orgs/omi-home/projects/1> | 4 item, field `Priority` + `Sprint`, view #2–#4 |

Việc tạo fixture GitHub được người dùng cho phép rõ ràng trong chat. Không thay đổi cấu hình cấp org (bước `createIssueType` bị chặn và đã bỏ).

## GO / NO-GO

| Spike | Câu hỏi | Quyết định | Căn cứ |
| --- | --- | --- | --- |
| [T0.1](T0.1.md) | Native workflow → plugin agent có tên, model/effort | **GO có giới hạn (adapter tùy chọn)** · đường chính vẫn là gọi agent trực tiếp | `agentType: "omi-spike:spike-backend"` chạy được, skill preload OK, override `model: opus` → `claude-opus-5-5` trong `modelUsage`; effort **không quan sát được**; không có `cwd`; `isolation: worktree` tạo worktree ngoài quản lý (locked, từ HEAD) |
| [T0.2](T0.2.md) | Main chỉ thấy metadata; subagent preload; hạn chế Skill | **GO (mặc định, không cưỡng chế)** | Body canary không có trong main, có trong subagent; `disallowedTools: Skill` hiệu lực; main vẫn tự load body được qua tool Skill |
| [T0.3](T0.3.md) | Agent ở trong worktree được giao | **GO** với adapter cwd tường minh | 2 task song song, không rò rỉ, main checkout sạch, `git worktree list` không đổi |
| [T0.4](T0.4.md) | Nạp AGENTS.md & thứ tự ưu tiên | **GO** | 3 cấu hình test trên main + subagent; không cần shim khi không có CLAUDE.md |
| [T0.5](T0.5.md) | API Issue/sub-issue/dependency/type/field/view | **GO** (Issue Type OMI → **fallback label**) | sub-issue 3 cấp, blockedBy, gán type có sẵn, item/field/iteration/view đều OK; API không idempotent → read-before-write; filter/group view không đặt được qua API |
| [T0.6](T0.6.md) | Liên kết PR↔Issue, `develop` mặc định | **GO có điều kiện** | `develop` default: issue tự đóng, `closingIssuesReferences` điền bất đồng bộ (≤15s); `main` default: không liên kết, issue vẫn mở |
| [T0.7](T0.7.md) | Branch protection theo visibility/plan | **GO (public)** · **NO-GO (private Free)** | public: push thẳng bị chặn 409 kể cả admin; private: protection/ruleset 403 "Upgrade to GitHub Pro", push thẳng thành công |
| [T0.8](T0.8.md) | Resume/outbox/cleanup sau squash | **GO** | replay cleanup có crash an toàn; reconcile marker → đúng 1 comment; cleanup theo receipt squash thật không cần `--force` |

## Quyết định của PO (đã chốt — xem [ADR-0001](../decisions/ADR-0001-phase0-outcomes.md))

1. **D1** Adapter MVP = gọi agent có tên trực tiếp (tiến trình riêng, cwd = worktree) + FSM của OMI CLI; native workflow chỉ là adapter tùy chọn cho bước chỉ-đọc; cấm `isolation: worktree`.
2. **D2** `actualEffort: unknown`; `actualModel` từ `modelUsage` / `message.model`.
3. **D3** Cách ly tuyệt đối: kiến thức chuyên môn chỉ ở `resources/role-rules/<role>/`, không đăng ký skill; agent đọc qua `${CLAUDE_PLUGIN_ROOT}` (đã xác minh, xem bổ sung trong [T0.2](T0.2.md)).
4. **D4** Đặt `develop` làm default branch trên repo thật.
5. **D5** Ưu tiên repo public; repo private trên Free phải ghi rõ chấp nhận rủi ro.
6. **D6** Issue Type có sẵn + label `type:*`.

Đã chốt thêm: repo `omi-home/omi-plugins` (public); giữ fixture GitHub cho M2; spec đã đồng bộ lên v2.1. Còn mở: cần quyền Write/Admin trên `omi-home/omi-plugins` (xem ADR-0001).

## Dọn dẹp fixture

Token thiếu `delete_repo`. Khi không cần nữa: chạy `gh auth refresh -h github.com -s delete_repo` rồi `gh repo delete omi-home/omi-spike-p0-20261117 --yes` (và bản private), `gh project delete 1 --owner omi-home`; hoặc xóa trên giao diện GitHub.
