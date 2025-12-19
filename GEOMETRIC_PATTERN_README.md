# Geometric Background Pattern

A beautiful, reusable CSS-based geometric background pattern system featuring pastel rainbow gradients with diamond/rhombus shapes.

## Features

- 🎨 **Pastel Rainbow Colors**: 7 soft, translucent colors creating smooth gradients
- 💎 **Geometric Shapes**: Diamond and rhombus patterns using pure CSS gradients
- ✨ **Subtle Animation**: Optional shimmer effect for visual interest
- 🎛️ **Customizable**: Multiple modifiers for different use cases
- ⚡ **Performant**: Pure CSS, no images or heavy resources
- 📱 **Responsive**: Works seamlessly across all screen sizes

## Quick Start

Add the `geo-pattern-bg` class to any container:

```html
<div class="geo-pattern-bg">
    <h1>Your Content Here</h1>
    <p>Pattern appears as background</p>
</div>
```

## Available Patterns

### 1. Default Pattern
Standard pattern with medium opacity (0.6) and 80px shapes.

```html
<div class="geo-pattern-bg">
    <!-- Your content -->
</div>
```

### 2. Strong Pattern
Higher visibility with 0.8 opacity - great for hero sections.

```html
<div class="geo-pattern-bg geo-pattern-bg-strong">
    <!-- Your content -->
</div>
```

### 3. Subtle Pattern
Very light with 0.3 opacity - perfect for content sections.

```html
<div class="geo-pattern-bg geo-pattern-bg-subtle">
    <!-- Your content -->
</div>
```

### 4. Small Pattern
Smaller 50px shapes for a more detailed look.

```html
<div class="geo-pattern-bg geo-pattern-bg-small">
    <!-- Your content -->
</div>
```

### 5. Large Pattern
Larger 120px shapes for bold statements.

```html
<div class="geo-pattern-bg geo-pattern-bg-large">
    <!-- Your content -->
</div>
```

### 6. Static Pattern
No animation for better performance.

```html
<div class="geo-pattern-bg geo-pattern-bg-static">
    <!-- Your content -->
</div>
```

### 7. Triangular Pattern
Alternative pattern with triangular shapes.

```html
<div class="geo-pattern-triangular">
    <!-- Your content -->
</div>
```

### 8. Combining Modifiers
Mix and match modifiers for custom effects.

```html
<div class="geo-pattern-bg geo-pattern-bg-large geo-pattern-bg-strong geo-pattern-bg-static">
    <!-- Your content -->
</div>
```

## Color Palette

The pattern uses 7 pastel colors with 15% opacity:

| Color | CSS Variable | RGB Value |
|-------|-------------|-----------|
| Pastel Pink | `--geo-pattern-pastel-pink` | rgba(255, 182, 193, 0.15) |
| Pastel Peach | `--geo-pattern-pastel-peach` | rgba(255, 218, 185, 0.15) |
| Pastel Yellow | `--geo-pattern-pastel-yellow` | rgba(255, 253, 208, 0.15) |
| Pastel Mint | `--geo-pattern-pastel-mint` | rgba(189, 252, 201, 0.15) |
| Pastel Sky | `--geo-pattern-pastel-sky` | rgba(173, 216, 230, 0.15) |
| Pastel Lavender | `--geo-pattern-pastel-lavender` | rgba(230, 190, 255, 0.15) |
| Pastel Rose | `--geo-pattern-pastel-rose` | rgba(255, 193, 204, 0.15) |

## Customization

Adjust the pattern size using CSS variables:

```css
.my-custom-section {
    --geo-pattern-size: 100px; /* Default is 80px */
}
```

Or create completely custom variations:

```css
.my-custom-pattern {
    position: relative;
    overflow: hidden;
}

.my-custom-pattern::before {
    /* Copy and modify the pattern styles */
    --geo-pattern-size: 60px;
    opacity: 0.5;
}
```

## Browser Support

Works in all modern browsers that support:
- CSS gradients
- CSS animations
- CSS custom properties (variables)

## Performance

- **Pure CSS**: No JavaScript required
- **No images**: All patterns generated with CSS gradients
- **GPU accelerated**: Uses transform for smooth animations
- **Optional animation**: Use `geo-pattern-bg-static` for static version

## Examples

See `pattern-examples.html` for live demonstrations of all pattern variations.

## Integration

The pattern is integrated into the following sections of Literacy Pal:

- **Home Hero** (`.home-hero`)
- **Interventions Header** (`.interventions-header`)
- **Hero Areas** (`.hero-area`)

## Technical Details

### Implementation
- Pattern created using multiple layered CSS linear gradients
- Positioned using `::before` pseudo-element
- Content positioned above pattern with `z-index: 1`
- Rainbow gradient overlay for smooth color transitions

### Z-Index Management
- Pattern: `z-index: 0` (background)
- Content: `z-index: 1` (foreground)

### Animation
- 30-second infinite loop
- Subtle shimmer effect (opacity and transform)
- Disabled with `geo-pattern-bg-static` modifier

## Credits

Created for the Literacy Pal application by the LRSD development team.

## License

© 2025 Literacy Pal - Part of the Literacy Intervention Assistant system.
