import sys
import httpx
try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.text import Text
    from rich.theme import Theme
except ImportError:
    print("Error: 'rich' library is required. Please install it with 'pip install rich'")
    sys.exit(1)

# Define custom theme for structured logging
custom_theme = Theme({
    "info": "dim cyan",
    "warning": "magenta",
    "error": "bold red",
    "success": "bold green",
})

console = Console(theme=custom_theme)

def run_client():
    """Runs the client with Rich console output."""
    console.print(Panel.fit("Starting Demo Client...", title="🚀 Client", border_style="blue"))

    try:
        # Show a spinner while connecting
        with console.status("[bold green]Connecting to server...", spinner="dots"):
            response = httpx.get("http://localhost:2026/hello")
        
        # Structured logging event
        console.log("[success]Connection established successfully![/success]")
        
        # Display response in a minimal, segmented panel
        content = Text(response.text, justify="center", style="bold white")
        console.print(Panel(
            content,
            title="🤖 Server Response",
            subtitle=f"[dim]Status: {response.status_code}[/dim]",
            border_style="cyan",
            expand=False,
            padding=(1, 2)
        ))
        
    except httpx.RequestError as e:
        console.print(Panel(
            f"[error]Connection failed:[/error] {e}",
            title="🛑 Network Error",
            border_style="red",
            expand=False
        ))
        sys.exit(1)
    except Exception as e:
        console.print(Panel(
            f"[error]An unexpected error occurred:[/error] {e}",
            title="💥 System Error",
            border_style="red",
            expand=False
        ))
        sys.exit(1)

if __name__ == "__main__":
    run_client()
