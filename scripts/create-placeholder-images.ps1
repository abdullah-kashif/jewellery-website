$products = @(
  @{ slug = "diamond-solitaire-ring"; name = "Diamond Solitaire Ring"; folder = "products" },
  @{ slug = "pearl-drop-earrings"; name = "Pearl Drop Earrings"; folder = "products" },
  @{ slug = "gold-tennis-bracelet"; name = "Gold Tennis Bracelet"; folder = "products" },
  @{ slug = "emerald-cut-ring"; name = "Emerald Cut Ring"; folder = "products" },
  @{ slug = "diamond-pendant"; name = "Diamond Pendant"; folder = "products" },
  @{ slug = "ruby-halo-ring"; name = "Ruby Halo Ring"; folder = "products" },
  @{ slug = "custom-name-pendant"; name = "Custom Name Pendant"; folder = "products" },
  @{ slug = "custom-engagement-ring"; name = "Custom Engagement Ring"; folder = "products" },
  @{ slug = "bridal-jewellery-set"; name = "Bridal Jewellery Set"; folder = "products" },
  @{ slug = "sapphire-bracelet"; name = "Sapphire Bracelet"; folder = "products" },
  @{ slug = "round-brilliant-diamond"; name = "Round Brilliant Diamond"; folder = "gemstones" },
  @{ slug = "oval-ruby-gemstone"; name = "Oval Ruby Gemstone"; folder = "gemstones" },
  @{ slug = "emerald-cut-emerald"; name = "Emerald Cut Emerald"; folder = "gemstones" },
  @{ slug = "blue-sapphire-oval-stone"; name = "Blue Sapphire Oval Stone"; folder = "gemstones" },
  @{ slug = "opal-cabochon-stone"; name = "Opal Cabochon Stone"; folder = "gemstones" }
)

foreach ($item in $products) {
  $path = "public/images/$($item.folder)/$($item.slug).svg"

  $svg = @"
<svg width="1200" height="1200" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="1200" fill="#fbf7ef"/>
  <rect x="90" y="90" width="1020" height="1020" rx="80" fill="#ffffff" stroke="#eadfca" stroke-width="6"/>
  <circle cx="600" cy="470" r="190" fill="#d6b46a" opacity="0.25"/>
  <path d="M600 250L760 470L600 710L440 470L600 250Z" fill="#d6b46a"/>
  <path d="M440 470H760" stroke="#7a5a1e" stroke-width="12"/>
  <path d="M600 250V710" stroke="#7a5a1e" stroke-width="12"/>
  <text x="600" y="850" text-anchor="middle" font-family="Georgia, serif" font-size="54" fill="#111111">$($item.name)</text>
  <text x="600" y="920" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" letter-spacing="8" fill="#a77a25">LUXORA FINE JEWELLERY</text>
</svg>
"@

  Set-Content -Path $path -Value $svg -Encoding UTF8
}

Write-Host "Placeholder images created successfully."