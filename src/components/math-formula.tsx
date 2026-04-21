"use client";

import katex from "katex";

type MathFormulaProps = {
  latex: string;
  displayMode?: boolean;
};

export default function MathFormula({
  latex,
  displayMode = false,
}: MathFormulaProps) {
  const html = katex.renderToString(latex, {
    displayMode,
    throwOnError: false,
    strict: "ignore",
  });

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
