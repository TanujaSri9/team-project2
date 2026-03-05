import os
import re

branding = {
    "restaurant_azure_haven.html": "Azure Haven Grill",
    "restaurant_indigo_silk.html": "Indigo Silk Thai Kitchen",
    "restaurant_ember_grill.html": "Ember Grill Cantina",
    "restaurant_gilded_bun.html": "The Gilded Bun Burgerie",
    "restaurant_velvet_churn.html": "Velvet Churn Gelato Bar",
    "restaurant_saffron_court.html": "Saffron Court Baklava House",
    "restaurant_zaffran_skies.html": "Zaffran Skies Kebab Hub",
    "restaurant_iberia_social.html": "Iberia Social Tapas",
    "restaurant_rustic_timber.html": "Rustic Timber Smokehouse",
    "restaurant_curry_leaf.html": "Curry Leaf Hub",
    "restaurant_pampas_star.html": "Pampas Star Parrilla",
    "restaurant_gaucho_pride.html": "Gaucho Pride Churrascaria",
    "restaurant_lotus_mist.html": "Lotus Mist Pho House",
    "restaurant_kimchi_soul.html": "Kimchi Soul BBQ",
    "restaurant_neon_bistro.html": "Neon Bistro Night Kitchen",
    "restaurant_copper_barrel.html": "Copper Barrel Brew House"
}

def fix_branding():
    for filename, name in branding.items():
        if os.path.exists(filename):
            print(f"Fixing branding in {filename}...")
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Simple broad-stroke replacement of potential names
            # (Matches anything between tags or in title that looks like a name)
            old_names = [
                "Aloha Island BBQ", "Bangkok Spice", "El Fuego", "Empire Burger",
                "Gelato Roma", "Istanbul Baklava", "Istanbul Flame", "La Fiesta",
                "Lone Star", "Masala Junction", "Rio Flame", "Rio Grande",
                "Saigon Pho", "Seoul Fire", "Seoul Night Bites", "Smoky Barrel",
                "Azure Haven Grill", "Indigo Silk Thai Kitchen", "Ember Grill Cantina",
                "The Gilded Bun Burgerie", "Velvet Churn Gelato Bar", "Saffron Court Baklava House",
                "Zaffran Skies Kebab Hub", "Iberia Social Tapas", "Rustic Timber Smokehouse",
                "Curry Leaf Hub", "Pampas Star Parrilla", "Gaucho Pride Churrascaria",
                "Lotus Mist Pho House", "Kimchi Soul BBQ", "Neon Bistro Night Kitchen",
                "Copper Barrel Brew House"
            ]
            
            # First, update the <title>
            content = re.sub(r'<title>.*?</title>', f'<title>{name}</title>', content)
            
            # Update the logo div (class="logo")
            content = re.sub(r'<div class="logo">.*?</div>', f'<div class="logo">{name}</div>', content)
            
            # Update any "About X" headings
            content = re.sub(r'<h2>About .*?</h2>', f'<h2>About {name}</h2>', content)
            content = re.sub(r'<h3>About .*?</h3>', f'<h3>About {name}</h3>', content)
            
            # Update footers
            content = re.sub(r'&copy; 2026 .*?\.', f'&copy; 2026 {name}.', content)

            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)

fix_branding()
print("Branding fix complete.")
