# Kids Keyboard Playground

A simple child-friendly Persian/English keyboard playground designed for an Android phone or tablet connected to a physical USB keyboard via OTG.

## Version 1

- Persian and English modes
- Letter-only mode
- Letter + example-word mode
- Large animated characters
- Text-to-Speech using the device/browser voice
- Higher voice pitch for a more child-like sound
- Standard Persian physical QWERTY mapping
- Playful responses for numbers, arrows, Enter, Space, Backspace, Function keys, and other common keys
- No backend, account, or tracking

## Hardware

- Android phone/tablet
- USB keyboard
- USB OTG adapter compatible with the Android device

## Run locally

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

This is a static project and can be deployed directly from the repository root.

Settings → Pages → Deploy from a branch → `main` / root.

## Voice note

Version 1 uses the browser/device Text-to-Speech engine with a raised pitch. It is not a true recorded child voice. A later version can use pre-recorded audio assets for consistent, natural child narration.

## Persian physical-key mapping

Persian mode reacts to physical key codes, so the mapping is independent of the Android software keyboard language. Examples:

- `H` → ا
- `F` → ب
- `[` → ج
- `]` → چ
- `\` → پ
- `;` → ک
- `'` → گ
- `,` → و

## Privacy

Everything runs in the browser. Keystrokes are not sent to a backend.

## License

MIT
