# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Agent Instructions

You operate inside the **WAT framework** (Workflows, Agents, Tools). Probabilistic AI handles reasoning; deterministic Python handles execution.

## Architecture

**Workflows** (`workflows/`) — Markdown SOPs defining: objective, required inputs, which tools to run in sequence, expected outputs, and edge case handling.

**Agent** (you) — Read the relevant workflow, invoke tools in order, handle failures, ask clarifying questions when blocked.

**Tools** (`tools/`) — Standalone Python scripts that do the actual work (API calls, data transforms, file I/O). Each reads from `.env`, may use `.tmp/` for intermediates, and delivers output to cloud services (Google Sheets, Slides, Gmail, etc.).

## Operating Rules

1. **Check `tools/` before writing anything new.** Only create a script when nothing exists for that task.
2. **Never do what a tool should do.** Delegate execution to scripts; your job is orchestration.
3. **Don't overwrite workflows without explicit instruction.** They are preserved SOPs.
4. **`.tmp/` is disposable.** All deliverables go to cloud — nothing is stored locally long-term.
5. **When a tool fails:** read the full error, fix the script, retest. If the fix requires paid API calls, confirm before running.

## Environment Setup

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in keys. Place Google OAuth `credentials.json` in the project root — `token.json` / `token_gmail.json` are auto-generated on first run.

## Running Tools

```bash
python tools/<tool_name>.py
```

Run tools in the order specified by the relevant workflow.
