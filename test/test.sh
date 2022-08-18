#!/bin/bash

test_header() {
    echo "////////////////////////////////////////////////"
    echo "//"
    echo "// $1"
    echo "//"
    echo "////////////////////////////////////////////////"
}

cd "$(dirname "$0")"

touch temp_out.txt
readonly TEST_DIRECTORY="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
readonly TEMP_OUTPUT="${TEST_DIRECTORY}temp_out.txt"

# Test `quest`

test_header "Calling \`quest\` only should print banner + help" >> "${TEMP_OUTPUT}"
quest >> "${TEMP_OUTPUT}"

test_header "Calling \`quest --help\` should print help" >> "${TEMP_OUTPUT}"
quest --help >> "${TEMP_OUTPUT}"

# TODO: Test that `quest` outputs correct message when called outside package

# Test `quest test`

cp -r test_campaign ../campaigns/
cd ../campaigns/test_campaign

test_header "Calling \`test\` outside a quest should print error message" >> "${TEMP_OUTPUT}"
quest test 1 >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` inside a quest should work" >> "${TEMP_OUTPUT}"
cd ./test_quest
quest test 1 >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` without an integer should run all tests" >> "${TEMP_OUTPUT}"
quest test >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` with an invalid integer should print error message" >> "${TEMP_OUTPUT}"
quest test abc >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` inside a subfolder in the quest folder should work" >> "${TEMP_OUTPUT}"
cd contracts
quest test 2 >> "${TEMP_OUTPUT}"

# TODO: `quest find`

# Test output difference (exclude timing differences)
diff "${TEMP_OUTPUT}" "${TEST_DIRECTORY}/expected_out.txt" \
    | grep -wv -e "passing ([0-9]\{2,3\}ms)" -e "---" -e "[0-9]\{2,3\}c[0-9]\{2,3\}"

# Remove temporary folders / files
rm "${TEMP_OUTPUT}"
rm -rf "${TEST_DIRECTORY}/../campaigns/test_campaign"