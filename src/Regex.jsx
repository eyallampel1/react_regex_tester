import { useState, useEffect } from 'react';

const RegexTester = ({ initialRegex = '', initialTestText = '', initialFlags = { global: true, multiline: true, caseInsensitive: false } }) => {
    const [regex, setRegex] = useState(initialRegex);
    const [testText, setTestText] = useState(initialTestText);
    const [highlightedText, setHighlightedText] = useState(initialTestText ? initialTestText.replace(/\n/g, '<br>') : '');
    const [global, setGlobal] = useState(initialFlags.global);
    const [caseInsensitive, setCaseInsensitive] = useState(initialFlags.caseInsensitive);
    const [multiline, setMultiline] = useState(initialFlags.multiline);
    const [matchInfo, setMatchInfo] = useState([]);

    useEffect(() => {
        applyRegex();
    }, [regex, testText, global, caseInsensitive, multiline]);

    const formatMatchInfo = (matchDetails) => {
        return matchDetails.map((match, index) => {
            const formattedMatches = [`Match ${index + 1} : ${match[0].startPos}-${match[0].endPos} : ${match[0].content}`];
            const formattedGroups = match.slice(1).map(group =>
                `Group ${group.groupNum} : ${group.startPos}-${group.endPos} : ${group.content}`
            );
            return [...formattedMatches, ...formattedGroups].join('\n');
        }).join('\n\n');
    };

    const applyRegex = () => {
        try {
            if (regex.trim() !== '') {
                let flags = '';
                if (global) flags += 'g';
                if (caseInsensitive) flags += 'i';
                if (multiline) flags += 'm';

                const regexPattern = new RegExp(regex, flags);
                let matches = global ? [...testText.matchAll(regexPattern)] : [testText.match(regexPattern)].filter(Boolean);

                const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
                let colorIndex = 0;
                let lastIndex = 0;
                let newHighlightedText = '';

                matches.forEach(match => {
                    const start = match.index;
                    const end = start + match[0].length;
                    const color = colors[colorIndex++ % colors.length];
                    newHighlightedText += testText.slice(lastIndex, start);
                    newHighlightedText += `<mark style="background-color: ${color};">${testText.slice(start, end)}</mark>`;
                    lastIndex = end;
                });

                newHighlightedText += testText.slice(lastIndex);
                setHighlightedText(newHighlightedText.replace(/\n/g, '<br>'));

                const matchDetails = matches.map(match => {
                    const fullMatch = {
                        content: match[0],
                        isParticipating: true,
                        groupNum: 0,
                        startPos: match.index,
                        endPos: match.index + match[0].length
                    };

                    let lastEndPos = match.index;
                    const groupDetails = match.slice(1).map((group, index) => {
                        const groupStartPos = lastEndPos + (index === 0 ? 0 : match[0].slice(lastEndPos - match.index).indexOf(group));
                        lastEndPos = groupStartPos + (group ? group.length : 0);

                        return {
                            content: group,
                            isParticipating: group !== undefined,
                            groupNum: index + 1,
                            startPos: groupStartPos,
                            endPos: lastEndPos
                        };
                    });

                    return [fullMatch, ...groupDetails];
                });

                setMatchInfo(matchDetails);
                let formattedHighlightedText = newHighlightedText.replace(/\n/g, '<br>');
                setHighlightedText(formattedHighlightedText);
            } else {
                // Replace \n with <br> when no regex is applied
                setHighlightedText(testText.replace(/\n/g, '<br>'));
            }
        } catch (error) {
            setHighlightedText(`Error in regex: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Regex Tester</h1>
            <div>
                <label>
                    Enter regex:
                    <input
                        type="text"
                        value={regex}
                        onChange={(e) => setRegex(e.target.value)}
                    />
                </label>
            </div>
            <div className="checkbox-container">
                <label>
                    Global
                    <input
                        type="checkbox"
                        checked={global}
                        onChange={() => setGlobal(!global)}
                    />
                </label>
                <label>
                    Case Insensitive
                    <input
                        type="checkbox"
                        checked={caseInsensitive}
                        onChange={() => setCaseInsensitive(!caseInsensitive)}
                    />
                </label>
                <label>
                    Multiline
                    <input
                        type="checkbox"
                        checked={multiline}
                        onChange={() => setMultiline(!multiline)}
                    />
                </label>
            </div>
            <h2 dangerouslySetInnerHTML={{__html: highlightedText}}/>
            <div>
                <label>
                    Test text:
                    <textarea
                        value={testText}
                        onChange={(e) => setTestText(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <h3>Formatted Match Information</h3>
                <pre>{formatMatchInfo(matchInfo)}</pre> {/* Display formatted match information */}
                <h3>Match Information</h3>
                <pre>{JSON.stringify(matchInfo, null, 2)}</pre> {/* Display match information in JSON */}
            </div>
        </div>
)};

export default RegexTester;