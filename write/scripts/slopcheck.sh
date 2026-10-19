#!/usr/bin/env bash
# slopcheck.sh <file.md> — flags AI tells in a draft.
# Phrase hits are printed with line numbers; cadence stats are printed at the end.
# It catches vocabulary and some constructions. It cannot catch cadence or
# hollow arguments, so it is never a substitute for reading anti-slop.md by hand.

set -uo pipefail

f="${1:-}"
if [[ -z "$f" || ! -f "$f" ]]; then
  echo "usage: slopcheck.sh <file.md>" >&2
  exit 2
fi

# Phrase checks run on prose only: frontmatter, HTML comments and code fences
# are notes, not writing, and flagging them wastes the run.
prose=$(mktemp -t slopcheck)
trap 'rm -f "$prose"' EXIT
python3 - "$f" > "$prose" <<'STRIP'
import re, sys
t = open(sys.argv[1], encoding="utf-8").read()
t = re.sub(r"\A---\n.*?\n---\n", "", t, flags=re.S)
t = re.sub(r"<!--.*?-->", "", t, flags=re.S)
t = re.sub(r"```.*?```", "", t, flags=re.S)
sys.stdout.write(t)
STRIP

hits=0

section() { printf '\n\033[1m%s\033[0m\n' "$1"; }

check() {
  local label="$1" pattern="$2"
  local out
  out=$(grep -nEi -- "$pattern" "$prose" | head -12) || true
  if [[ -n "$out" ]]; then
    printf '  \033[33m%s\033[0m\n' "$label"
    sed 's/^/    /' <<<"$out"
    hits=$((hits + 1))
  fi
}

section "Banned vocabulary"
check "corporate verbs"      '\b(delve|leverag(e|es|ed|ing)|streamlin(e|es|ed|ing)|unlock(s|ed|ing)?|supercharg|empower|elevat(e|es|ed|ing)|harness(es|ed|ing)?|foster(s|ed|ing)?|curat(e|ed|ing))\b'
check "consultant nouns"     '\b(paradigm|synergy|holistic|game.?changer|double.?edged sword|tapestry|testament to|plethora|myriad|deep dive|dive deep)\b'
check "empty adjectives"     '\b(robust|seamless|pivotal|crucial|vital|cutting.?edge|state.?of.?the.?art)\b'
check "figurative cliches"   '\b(navigat(e|es|ing) the|the (AI|tech|current|modern) landscape|journey|unpack(s|ing)?|lean(s|ing)? into|resonat(e|es|ed|ing))\b'
check "filler phrases"       "(at the end of the day|it'?s worth noting|needless to say|in the realm of|a myriad of|when it comes to|the fact that)"
check "logical connectors"   '(^|[[:space:]])(moreover|furthermore|additionally|consequently|thus|hence),?[[:space:]]'

section "Banned constructions"
check "antithesis snap"      "((isn'?t|aren'?t|wasn'?t|weren'?t) (just )?[^.!?]{2,40}\\. (it|that|this|they|we|you)'?(s|re) |(it|that|this|we|you|they)'?(s|re)? not (just )?[^.,!?]{2,40}, (it|that|this|we|you|they)'?(s|re) |not about [^.,!?]{2,40}, it'?s about)"
check "fragment answer"      '(The (result|problem|catch|answer|reason|point|kicker|difference|takeaway))\?'
check "throat-clearing"      "(here'?s the thing|let'?s be clear|the truth is|make no mistake|let'?s talk about|i want to talk about|let that sink in)"
check "era framing"          '(in (today|an era|a world|the age)|as (AI|technology|the world) (becomes|gets|continues))'
check "signposting"          "(first,? let'?s|now that we'?ve|as (we|I)'?ll (see|discuss)|in this (post|essay|piece),? (I|we)'?ll|before we (dive|get) in)"
check "not only / but also"  '\bnot only\b.*\bbut also\b'
check "empty hedges"         "(arguably|it could be argued|some (might|would|may) (say|argue)|many (would|might) agree|in my (humble )?opinion)"
check "booster adverbs"      '\b(very|really|truly|genuinely|incredibly|significantly|dramatically|remarkably|utterly|absolutely) [a-z]+'
check "superlative reflex"   '\bone of the most\b'
check "inspiration close"    '(so go (build|make|do)|the future is|now go |start today)'
check "permission close"     "(and that'?s (okay|ok|fine)\\.)"
check "engagement bait"      '(thoughts\?|agree\?|am i wrong\?|what do you think\?)$'
check "emoji / hashtags"     '(🧵|^Thread:|#[A-Za-z]{3,}|[😀-🿿]|[🚀-🛿]|[✀-➿])'
check "colon title"          '^#{1,2} [^:]{3,}: [A-Z]'
check "mid-line bold"        '[a-z,] \*\*[^*]+\*\*'

section "Cadence"
python3 - "$f" <<'PY'
import re, sys, statistics as st

text = open(sys.argv[1], encoding="utf-8").read()
# drop frontmatter, html comments, code fences
text = re.sub(r"\A---\n.*?\n---\n", "", text, flags=re.S)
text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
text = re.sub(r"```.*?```", "", text, flags=re.S)

paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip() and not p.lstrip().startswith(("#", ">", "|", "-", "*"))]
sents = [s for s in re.split(r"(?<=[.!?])\s+", " ".join(paras)) if s.strip()]
words = text.split()
n = len(words)

def warn(msg):
    print(f"  \033[33m{msg}\033[0m")

print(f"  {n} words, {len(paras)} paragraphs, {len(sents)} sentences")

if not sents or not n:
    raise SystemExit(0)

# em dashes
em = text.count("—") + text.count(" -- ")
per300 = em / max(n, 1) * 300
print(f"  em dashes: {em} ({per300:.1f} per 300 words)")
if per300 > 1.2:
    warn("em dash overuse — cap is about 1 per 300 words")

# sentence length spread
sl = [len(s.split()) for s in sents]
print(f"  sentence words: min {min(sl)}, median {int(st.median(sl))}, max {max(sl)}")
if min(sl) > 6:
    warn("no short sentences — needs a few under 6 words to land points")
if max(sl) < 30:
    warn("no long sentences — uniform length is the clearest machine tell")
if len(sl) > 5 and st.pstdev(sl) < 6:
    warn(f"sentence lengths too uniform (stdev {st.pstdev(sl):.1f}, want > 6)")

# paragraph length spread
pl = [len([s for s in re.split(r'(?<=[.!?])\s+', p) if s.strip()]) for p in paras]
if pl:
    print(f"  paragraph sentences: min {min(pl)}, max {max(pl)}")
    if len(pl) > 4 and max(pl) - min(pl) <= 1:
        warn("every paragraph the same length — vary from 1 to 6 sentences")

# rule of three
threes = re.findall(r"\b\w+, \w+,? and \w+\b", text)
if len(threes) > 1:
    warn(f"{len(threes)} rule-of-three lists: " + "; ".join(threes[:3]))

# repeated sentence openers
opens = {}
for s in sents:
    w = s.strip().split()
    if w:
        opens[w[0].lower()] = opens.get(w[0].lower(), 0) + 1
rep = [(k, v) for k, v in opens.items() if v >= 4 and k not in ("the", "a", "it", "i")]
for k, v in sorted(rep, key=lambda x: -x[1])[:3]:
    warn(f'{v} sentences start with "{k}" — vary the openers')
PY

section "Result"
if [[ $hits -eq 0 ]]; then
  echo "  no phrase hits. Still read anti-slop.md and do the read-aloud pass."
else
  echo "  $hits phrase categories flagged above. Fix each, then re-run."
fi
