import React, { useRef, useEffect } from 'react';

import { InputGroup } from '@blueprintjs/core';

const MASK = '•';

const PasswordInput = ({ inputRef, value, onChange, ...props }) => {
    const ref = useRef();

    const setRef = node => {
        ref.current = node;
        if (inputRef) {
            // eslint-disable-next-line no-param-reassign
            inputRef.current = node;
        }
    };

    const { selectionEnd = 0 } = ref.current || {};

    useEffect(() => {
        ref.current.selectionStart = selectionEnd;
        ref.current.selectionEnd = selectionEnd;
    });

    const onInnerChange = event => {
        const { value: masked } = event.target;
        const { selectionEnd: end } = ref.current;

        const match = masked.match(`^${MASK}*([^${MASK}]*)${MASK}*$`);

        const inserted = match[1];
        const begin = end - inserted.length;
        const delta = value.length - (masked.length - inserted.length);
        const unmasked = value.slice(0, begin) + inserted + value.slice(begin + delta);

        if (onChange) {
            onChange(unmasked);
        }
    };

    const innerValue = new Array(value.length + 1).join(MASK);

    return <InputGroup {...props} inputRef={setRef} value={innerValue} onChange={onInnerChange} />;
};

export default PasswordInput;
