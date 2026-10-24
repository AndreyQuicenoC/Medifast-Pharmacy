import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingState, ErrorState, PageShell } from "./PageState";

describe("PageState", () => {
  it("muestra mensaje de carga", () => {
    render(<LoadingState message="Espera..." />);
    expect(screen.getByRole("status").textContent).toContain("Espera...");
  });

  it("muestra error y boton reintentar", () => {
    render(<ErrorState message="Fallo" onRetry={() => {}} />);
    expect(screen.getByRole("alert").textContent).toContain("Fallo");
    expect(screen.getByRole("button", { name: /reintentar/i })).toBeTruthy();
  });

  it("PageShell renderiza hijos cuando no hay carga ni error", () => {
    render(
      <PageShell loading={false} error={null}>
        <p>Contenido</p>
      </PageShell>
    );
    expect(screen.getByText("Contenido")).toBeTruthy();
  });
});
