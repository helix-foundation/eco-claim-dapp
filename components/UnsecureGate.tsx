const UnsecureGate = () => (
    <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-xlarge)",
        flexDirection: "column"
    }}>
        <svg width="194" height="31" viewBox="0 0 194 31" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3, marginBottom: "var(--space-large)" }}>
            <g clipPath="url(#clip0_227_1062)">
                <circle cx="12.5" cy="15.5" r="12" stroke="black" />
                <mask id="mask0_227_1062" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="5"
                    width="21" height="21">
                    <circle cx="12.5" cy="15.5" r="10.5" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_227_1062)">
                    <rect x="-1" y="4" width="14" height="23" fill="black" />
                </g>
                <circle cx="56.5" cy="15.5" r="12" stroke="black" />
                <circle cx="56.5" cy="15.5" r="15" stroke="black" strokeDasharray="2 2" />
                <circle cx="100.5" cy="15.5" r="12" stroke="black" strokeDasharray="32 32" />
                <path d="M92 15.5H109" stroke="black" />
                <path d="M100.5 12L100.5 19" stroke="black" />
                <mask id="path-9-inside-1_227_1062" fill="white">
                    <path fillRule="evenodd" clipRule="evenodd"
                        d="M141.5 28C148.404 28 154 22.4036 154 15.5C154 8.59644 148.404 3 141.5 3C134.596 3 129 8.59644 129 15.5C129 22.4036 134.596 28 141.5 28ZM146.45 15.5L141.5 10.5503L136.55 15.5L141.5 20.4497L146.45 15.5Z" />
                </mask>
                <path fillRule="evenodd" clipRule="evenodd"
                    d="M141.5 28C148.404 28 154 22.4036 154 15.5C154 8.59644 148.404 3 141.5 3C134.596 3 129 8.59644 129 15.5C129 22.4036 134.596 28 141.5 28ZM146.45 15.5L141.5 10.5503L136.55 15.5L141.5 20.4497L146.45 15.5Z"
                    fill="black" />
                <path
                    d="M141.5 10.5503L142.207 9.84315L141.5 9.13604L140.793 9.84315L141.5 10.5503ZM146.45 15.5L147.157 16.2071L147.864 15.5L147.157 14.7929L146.45 15.5ZM136.55 15.5L135.843 14.7929L135.136 15.5L135.843 16.2071L136.55 15.5ZM141.5 20.4497L140.793 21.1569L141.5 21.864L142.207 21.1569L141.5 20.4497ZM153 15.5C153 21.8513 147.851 27 141.5 27V29C148.956 29 155 22.9558 155 15.5H153ZM141.5 4C147.851 4 153 9.14873 153 15.5H155C155 8.04416 148.956 2 141.5 2V4ZM130 15.5C130 9.14873 135.149 4 141.5 4V2C134.044 2 128 8.04416 128 15.5H130ZM141.5 27C135.149 27 130 21.8513 130 15.5H128C128 22.9558 134.044 29 141.5 29V27ZM140.793 11.2574L145.743 16.2071L147.157 14.7929L142.207 9.84315L140.793 11.2574ZM137.257 16.2071L142.207 11.2574L140.793 9.84315L135.843 14.7929L137.257 16.2071ZM142.207 19.7426L137.257 14.7929L135.843 16.2071L140.793 21.1569L142.207 19.7426ZM145.743 14.7929L140.793 19.7426L142.207 21.1569L147.157 16.2071L145.743 14.7929Z"
                    fill="black" mask="url(#path-9-inside-1_227_1062)" />
                <mask id="mask1_227_1062" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="170" y="5"
                    width="21" height="21">
                    <circle cx="180.5" cy="15.5" r="10.5" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask1_227_1062)">
                    <rect x="167" y="4" width="14" height="23" fill="black" />
                </g>
                <mask id="mask2_227_1062" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="181" y="5"
                    width="21" height="21">
                    <circle cx="191.5" cy="15.5" r="10.5" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask2_227_1062)">
                    <rect x="178.818" y="4" width="10.1818" height="23" fill="black" />
                </g>
                <mask id="mask3_227_1062" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="189" y="5"
                    width="21" height="21">
                    <circle cx="199.5" cy="15.5" r="10.5" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask3_227_1062)">
                    <rect x="188.136" y="4.5" width="5.36364" height="22" stroke="black" />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_227_1062">
                    <rect width="194" height="31" fill="white" />
                </clipPath>
            </defs>
        </svg>
        <p>If you see this page, you may be accessing Eco Claim through a malicious site.</p>
    </div>
)

export default UnsecureGate;