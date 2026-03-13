#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_ARGS=(
  -C "$ROOT"
  --search
  --enable multi_agent
  --dangerously-bypass-approvals-and-sandbox
)

usage() {
  cat <<'EOF'
Usage: ./codex-dinor.sh <mode> [prompt]

Modes:
  fast          Start interactive Codex in this repo with web search and high reasoning.
  resume        Resume the last Codex session in this repo with multi-agent enabled.
  review        Run a non-interactive code review with xhigh reasoning.
  exec          Run non-interactive Codex with web search and high reasoning.
  fork-ui       Fork the last session for frontend/UI work.
  fork-admin    Fork the last session for admin/auth work.
  fork-db       Fork the last session for Supabase/data-flow work.
  help          Show this help message.
EOF
}

mode="${1:-fast}"
if (($# > 0)); then
  shift
fi

case "$mode" in
  fast)
    exec codex "${BASE_ARGS[@]}" -c 'model_reasoning_effort="high"' "$@"
    ;;
  resume)
    exec codex "${BASE_ARGS[@]}" resume --last "$@"
    ;;
  review)
    exec codex "${BASE_ARGS[@]}" review -c 'model_reasoning_effort="xhigh"' "$@"
    ;;
  exec)
    exec codex "${BASE_ARGS[@]}" exec -c 'model_reasoning_effort="high"' "$@"
    ;;
  fork-ui)
    prompt="${*:-프론트엔드/UI 범위만 맡아. 기존 디자인 언어를 유지하고, 수정 전 영향 범위와 리스크를 먼저 정리해.}"
    exec codex "${BASE_ARGS[@]}" fork --last -c 'model_reasoning_effort="high"' "$prompt"
    ;;
  fork-admin)
    prompt="${*:-관리자 인증, 문의 관리, 운영 화면 범위만 맡아. 보안과 데이터 누락 위험을 먼저 보고 진행해.}"
    exec codex "${BASE_ARGS[@]}" fork --last -c 'model_reasoning_effort="high"' "$prompt"
    ;;
  fork-db)
    prompt="${*:-Supabase 데이터 모델, repository 계층, inquiry 저장 흐름만 맡아. 민감정보와 데이터 정합성을 우선 점검해.}"
    exec codex "${BASE_ARGS[@]}" fork --last -c 'model_reasoning_effort="high"' "$prompt"
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    printf 'Unknown mode: %s\n\n' "$mode" >&2
    usage >&2
    exit 1
    ;;
esac
