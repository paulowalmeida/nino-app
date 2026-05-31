import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the text correctly", () => {
    render(<Button>Confirmar</Button>);
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
  });

  it("calls onClick on click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clique</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Clique</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} loading>Clique</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("sets aria-busy when loading", () => {
    render(<Button loading>Salvando</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("applies extra className without overriding base classes", () => {
    render(<Button className="mt-4">Botão</Button>);
    expect(screen.getByRole("button")).toHaveClass("mt-4");
    expect(screen.getByRole("button")).toHaveClass("inline-flex");
  });

  it.each(["primary", "secondary", "outline", "ghost"] as const)(
    "renderiza variante %s sem erros",
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    }
  );

  it.each(["sm", "md", "lg"] as const)("renderiza tamanho %s sem erros", (size) => {
    render(<Button size={size}>{size}</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders as child element with asChild", () => {
    render(
      <Button asChild>
        <a href="/rota">Link</a>
      </Button>
    );
    expect(screen.getByRole("link", { name: "Link" })).toBeInTheDocument();
  });
});
