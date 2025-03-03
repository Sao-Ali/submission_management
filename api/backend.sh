#!/bin/sh
################## SKELETON: DO NOT TOUCH THESE 2 LINES
EXEDIR=`dirname "$0"`; BASENAME=`basename "$0" .sh`; TAB='	'; NL='
'
#################### ADD YOUR USAGE MESSAGE HERE, and the rest of your code after END OF SKELETON ##################
USAGE="USAGE: $BASENAME <input file>
PURPOSE: a simple backend to a website; it produces output that should be displayed on the website's output interface"

################## SKELETON: DO NOT TOUCH CODE HERE
# check that you really did add a usage message above
USAGE=${USAGE:?"$0 should have a USAGE message before sourcing skel.sh"}
die(){ echo "$USAGE${NL}FATAL ERROR in $BASENAME:" "$@" >&2; exit 1; }
[ "$BASENAME" == skel ] && die "$0 is a skeleton Bourne Shell script; your scripts should source it, not run it"
echo "$BASENAME" | grep "[ $TAB]" && die "Shell script names really REALLY shouldn't contain spaces or tabs"
[ $BASENAME == "$BASENAME" ] || die "something weird with filename in '$BASENAME'"
warn(){ (echo "WARNING: $@")>&2; }
not(){ if eval "$@"; then return 1; else return 0; fi; }
newlines(){ awk '{for(i=1; i<=NF;i++)print $i}' "$@"; }
parse(){ awk "BEGIN{print $*}" </dev/null; }

# Temporary Filename + Directory (both, you can use either, note they'll have different random stuff in the XXXXXX part)
TMPDIR=`mktemp -d /tmp/$BASENAME.XXXXXX`
 trap "/bin/rm -rf $TMPDIR; exit" 0 1 2 3 15 # call trap "" N to remove the trap for signal N

#################### END OF SKELETON, ADD YOUR CODE BELOW THIS LINE

[ $# -eq 1 ] || die "expecting exactly one argument"
[ -f "$1" ] || die "input file '$1' does not exist"

CHECKSUM_PATH="$(dirname "$0")/checksum"
[ -x "$CHECKSUM_PATH" ] || die "expecting checksum executable to exist in script directory"

# Debugging: Check if checksum exists and is executable
echo "Running checksum on: $1"
ls -l "$CHECKSUM_PATH"
ls -l "$1"
file "$CHECKSUM_PATH"
ldd "$CHECKSUM_PATH" || echo "ldd not avaliable"

CHECKSUM_SOURCE="$(dirname "$0")/checksum.c"
if [ -f "$CHECKSUM_SOURCE" ]; then
    echo "Checksum on checksum.c:"
    "$CHECKSUM_PATH" < "$CHECKSUM_SOURCE"
else
    echo "WARNING: checksum.c not found, skipping checksum on source file."
fi

# Ensure correct execution of checksum on input file
echo "Checksum on input file:"
if [ -x "$CHECKSUM_PATH" ]; then
    CHECKSUM_OUTPUT=$("$CHECKSUM_PATH" < "$1" 2>&1)
    echo "$CHECKSUM_OUTPUT"
else
    echo "ERROR: checksum executable not found or not executable"
fi

echo "Checking checksum binary:"
ls -l "$CHECKSUM_PATH"
file "$CHECKSUM_PATH"
ldd "$CHECKSUM_PATH" || echo "ldd not available"


echo "md5sum on input file:"
md5sum "$1" | sed "s|$1|$(basename "$1")|"

echo "Edges:"
wc -l "$1" | sed "s|$1|$(basename "$1")|"

echo "Nodes:"
cat "$1" | newlines | sort -u | wc -l
