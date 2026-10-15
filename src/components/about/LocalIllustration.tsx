/** Original decorative scene; the network does not represent a geographic map. */
export function LocalIllustration() {
  return <svg width="520" height="350" viewBox="0 0 520 350" fill="none" aria-hidden="true" focusable="false">
    <path d="M98 94c25-54 64-50 97-63 45-18 66 8 99 5 49-5 78-5 95 35 19 45 60 40 56 89-3 42-39 52-43 85-6 43-74 58-116 46-42-11-52 13-105-3-48-14-78-41-68-79 7-27-34-50-15-115Z" fill="#E0EEFF" />
    <g stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity=".9">
      <path d="m173 65 12 46-27 45 36 42-14 52m89-205-14 67 37 25-15 41 29 44-15 55m-36-166-70-1m70 1 60-18 50 22m-61 20 71 32-10 54m-186-74 55-11 21 35-26 39m26-39 33-8m-47 47 43 9 54-18" />
    </g>
    <g fill="#EBF4FF">
      <path d="M28 118h63c0-13-8-21-20-21-7-16-34-10-34 5-7 0-9 7-9 16Z" />
      <path d="M421 64h72c0-13-9-20-23-20-8-22-39-18-41 6-6 0-8 7-8 14Z" />
      <path d="M77 324h411c0-9-9-16-19-15-4-13-21-18-32-10H96c-11 0-19 11-19 25Z" />
    </g>
    {[{ x: 206, y: 84 }, { x: 337, y: 90 }, { x: 229, y: 160 }, { x: 158, y: 207 }].map(({ x, y }) => <g key={x} transform={`translate(${x} ${y})`}>
      <path d="M0-11C-7-11-10-7-10-2c0 7 10 16 10 16S10 5 10-2C10-7 7-11 0-11Z" fill="#0867F9" stroke="#FFF" strokeWidth="2" /><circle cy="-2" r="3" fill="#FFF" />
    </g>)}
    <path d="M92 324h379" stroke="#C7DEFA" strokeWidth="2" />
    <g>
      <path d="M161 283h62v41h-62z" fill="#FFF" /><path d="m154 283 13-19h52l12 19" fill="#70ACEB" />
      <path d="M204 293h10v31h-10zM170 293h13v12h-13zM188 293h10v12h-10z" fill="#8ABBEE" />
      <path d="M263 253h40v71h-40z" fill="#F9FCFF" /><path d="m258 253 9-18h32l9 18" fill="#76ADE6" />
      <path d="M272 264h7v12h-7zM287 264h7v12h-7zM272 285h7v12h-7zM287 285h7v12h-7zM281 307h8v17h-8z" fill="#72A9E6" />
      <path d="M351 225h42v99h-42z" fill="#FFF" /><path d="M358 234h8v12h-8zM378 234h8v12h-8zM358 255h8v12h-8zM378 255h8v12h-8zM358 276h8v12h-8zM378 276h8v12h-8zM369 304h8v20h-8z" fill="#75A9E4" />
      <path d="M393 277h26v47h-26z" fill="#9BC4EE" /><path d="M402 287h6v10h-6zM402 305h6v10h-6z" fill="#72A9E6" />
    </g>
    {[{ x: 118, y: 291, size: .7 }, { x: 243, y: 278, size: 1 }, { x: 326, y: 296, size: .75 }, { x: 443, y: 277, size: 1 }].map(({ x, y, size }) => <g key={x} transform={`translate(${x} ${y}) scale(${size})`}>
      <path d="M0-33c-12 0-15 10-13 18-15-1-18 19-10 26-2 15 17 22 26 17 21 6 32-15 22-27 5-17-11-23-17-17C11-26 8-33 0-33Z" fill="#48C296" />
      <path d="M0-10v57m0-24-10-10M0 12l11-11" stroke="#21856D" strokeWidth="3" strokeLinecap="round" />
    </g>)}
  </svg>;
}
