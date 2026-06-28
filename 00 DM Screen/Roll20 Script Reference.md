## Quick Reference - Most Used Commands

```
!group-init                  # Roll initiative for selected tokens
!group-check --<ability>     # Roll group checks (e.g., --Perception, --DEX)
!token-mod --set <property>|<value>  # Modify token properties
!aura                        # Open HealthColors menu
!ta                          # Create token actions for selected character
!tnn --renumber              # Renumber tokens on page
```

---

## GroupInitiative

**Basic Commands**

- `!group-init` - Roll initiative for all selected tokens and add to turn tracker
- `!group-init --bonus <value>` - Roll initiative with a bonus modifier
- `!group-init --reroll` - Reroll initiative for all tokens currently in turn order
- `!group-init --clear` - Remove all tokens from turn order
- `!group-init --sort` - Sort the turn tracker
- `!group-init --help` - Display help and current configuration

**Advanced Commands**

- `!group-init --ids <token_id> [<token_id> …]` - Roll initiative for specific token IDs
- `!group-init --adjust <value>` - Adjust all turn order values by specified amount
- `!group-init --adjust-current <value>` - Adjust only the current turn's initiative

**Configuration Commands**

- `!group-init-config --set-roller|<roller_type>` - Set the roller type (e.g., Individual-Roll)
- `!group-init-config --set-dice-count|<number>` - Set number of dice to roll for initiative
- `!group-init --add-group --<adjustment> <attribute>` - Add a bonus stat group
- `!group-init --del-group <index>` - Delete a bonus stat group by index number
- `!group-init --promote <index>` - Move a bonus stat group up in priority

**Common D&D 5e Setup**

For the 5e OGL sheet, use these commands to configure:

```
!group-init-config --set-dice-count|0
!group-init --del-group 1
!group-init --add-group --bare initiative_formula
```

---

## GroupCheck

**Basic Commands**

- `!group-check` - Show list of available check buttons
- `!group-check --<CheckCommand>` - Roll a specific check for selected tokens

**Configuration Commands**

- `!group-check-config --show` - Display current checks and default options
- `!group-check-config --import <preset>` - Import predefined checks (e.g., "5E-OGL")
- `!group-check-config --add {"<Command>": {"name": "<Name>", "formula": "<formula>"}}` - Add custom check
- `!group-check-config --defaults` - Reset options to factory defaults
- `!group-check-config --reset` - Clear all checks and reset options

**Options**

- `--whisper` - Whisper results to GM
- `--public` - Output results publicly
- `--adv` - Roll with advantage
- `--dis` - Roll with disadvantage
- `--ids <token_ids>` - Target specific tokens by ID
- `--subheader <text>` - Add text below the check title
- `--input <value1>,<value2>` - Replace INPUT_0, INPUT_1 in formulas (e.g., for DCs)
- `--showaverage` - Show average of all rolls (requires --process)
- `--process` - Enable result processing
- `--custom <CheckName>, <formula>` - Create a one-time custom check

**Common D&D 5e Checks**

After importing 5E-OGL preset, common commands include:

```
!group-check --STR             # Strength check
!group-check --DEX             # Dexterity check
!group-check --Perception      # Perception check
!group-check --Stealth         # Stealth check
!group-check --STR-save        # Strength saving throw
!group-check --DEX-save        # Dexterity saving throw
```

---

## TokenMod

**Basic Commands**

- `!token-mod --help` - Display help and all available properties
- `!token-mod --config` - Open configuration menu

**Common Property Modifications**

**Bar Values:**

```
!token-mod --set bar1_value|20              # Set bar1 current value
!token-mod --set bar1_max|50                # Set bar1 max value
!token-mod --set bar1_link|hp               # Link bar1 to attribute
!token-mod --set bar1_value|+5              # Increase bar1 by 5
!token-mod --set bar1_value|-3              # Decrease bar1 by 3
```

**Status Markers:**

```
!token-mod --set statusmarkers|red          # Add red marker
!token-mod --set statusmarkers|red:3        # Add red marker with number 3
!token-mod --set statusmarkers|-red         # Remove red marker
!token-mod --set statusmarkers|=blue        # Clear all and set only blue
!token-mod --set statusmarkers|!blue        # Toggle blue marker on/off
```

**Lighting (Updated Dynamic Lighting):**

```
!token-mod --on emits_bright_light emits_low_light --set bright_light_distance|20 low_light_distance|20
!token-mod --set emits_bright_light|on emits_low_light|on bright_light_distance|40 low_light_distance|20 light_angle|360
!token-mod --off emits_bright_light emits_low_light
```

**Vision:**

```
!token-mod --set has_bright_light_vision|on bright_light_vision|60
!token-mod --set has_night_vision|on night_vision_distance|60
```

**Auras:**

```
!token-mod --set aura1_radius|35 aura1_color|#00ff00
!token-mod --on show_aura1
!token-mod --off show_aura1
```

**Other Properties:**

```
!token-mod --set name|"Goblin Chief"        # Set token name
!token-mod --set layer|objects              # Move to objects layer
!token-mod --set rotation|180               # Rotate token
!token-mod --set currentside|2              # Change multi-sided token
!token-mod --set tint_color|#ff0000         # Tint token red
!token-mod --set tint_color|transparent     # Clear tint
!token-mod --flip fliph flipv               # Flip horizontal and vertical
!token-mod --on showname                    # Show token name
!token-mod --off showname                   # Hide token name
!token-mod --set controlledby|<player_id>   # Set controller
!token-mod --set represents|<char_id>       # Link to character
!token-mod --set defaulttoken               # Save current settings as default
```

**Targeting Options**

- `--ignore-selected` - Don't modify selected tokens
- `--current-page` - Only modify tokens on current page
- `--ids <token_id> […]` - Specify tokens by ID

**Multi-line Format:**

```
!token-mod {{
  --set bar1_value|20
        bar2_value|50
        light_radius|40
        name|"Bright Token"
  --on showname
  --flip fliph
}}
```

---

## HealthColors (Aura/Tint)

**Basic Commands**

- `!aura` - Open configuration menu with toggle buttons
- `!aura on` - Turn health coloring on
- `!aura off` - Turn health coloring off
- `!aura?` - Show help/settings
- `!aura update` - Force update of all tokens

**Configuration Commands**

- `!aura bar <number>` - Set which bar to use (1, 2, or 3)
- `!aura tint` - Toggle tint mode (vs aura mode)
- `!aura perc <percentage>` - Set health percentage threshold (default 100)
- `!aura pc` - Toggle display on PC tokens
- `!aura npc` - Toggle display on NPC tokens
- `!aura dead` - Toggle display on dead tokens
- `!aura gmnpc` - Toggle GM seeing NPC names
- `!aura gmpc` - Toggle GM seeing PC names

**Custom FX Commands**

- `!aura HURT <fx_id>` - Set custom FX for taking damage
- `!aura HEAL <fx_id>` - Set custom FX for healing
- `!aura deadfx <sound_name>` - Set death FX/sound

**Per-Token Control (requires ChatSetAttr)**

Enable/disable for specific tokens:

```
!setattr --sel --USECOLOR|YES
!aura update

!setattr --sel --USECOLOR|NO
!aura update
```

**Notes:**

- Script uses Aura1 and Aura2 by default (modified versions available that use only one)
- Colors transition from green (full health) to red (zero health)
- Works automatically when token HP changes

---

## Token Action Maker

**Basic Commands**

- `!ta` - Create full suite of token actions for selected character
- `!sortta` - Create token actions with prefixes for alphabetical sorting (prepends "a-" to actions, "la-" to legendary actions)
- `!deleteta` - Delete unprotected token actions (actions ending with a period are protected)
- `!deleteallta` - Delete ALL token actions (use with caution)
- `!ta help` - Display help documentation

**Argument Options**

Create specific types of abilities:

- `attacks` - Attack buttons (PC/NPC)
- `traits` - Trait buttons (PC/NPC - can be numerous on PCs)
- `pc` - Full suite except traits (recommended for PCs)
- `bonusactions` - Bonus action buttons (NPC only)
- `reactions` - Reaction buttons (NPC only)
- `actions` - Action buttons (NPC only)
- `legendary` - Legendary action buttons (NPC only)
- `spells` - Spell chat menu (PC/NPC)
- `checks` - Skill check dropdown (PC/NPC)
- `saves` - Saving throw dropdown (PC/NPC)
- `init` - Initiative button (PC/NPC)
- `name` - Use character name instead of ID in macros

**Examples:**

```
!ta                           # Create all token actions
!ta pc                        # Create all except traits
!ta attacks saves checks      # Create only attacks, saves, and checks
!ta name                      # Create all, using character names
!sortta                       # Create all with alphabetical prefixes
```

**Pathfinder 2e:**

All PF2 commands require adding "pf2" argument:

```
!ta pf2                       # Create all PF2 token actions
!ta pf2 attacks spells        # Create specific PF2 actions
```

**Notes:**

- Script works with D&D 5e by Roll20 and Pathfinder 2e by Roll20 sheets
- Token must represent a character sheet
- To protect a token action from deletion, add a period after its name

---

## TokenNameNumber

**Basic Commands**

- `!tnn` - Display help and configuration options
- `!tnn --help` - Display help
- `!tnn --renumber` - Reset numbers on page and fix hanging %%NUMBERED%% cases

**Usage:**

This script works automatically. To enable auto-numbering:

1. In the character name field, include `%%NUMBERED%%` somewhere in the name
    - Example: `Goblin %%NUMBERED%%` becomes "Goblin 1", "Goblin 2", etc.
2. When you drag tokens onto the map, they'll automatically be numbered
3. Numbers increment based on existing tokens on the page

**Notes:**

- `%%NUMBERED%%` must be in UPPERCASE
- Script handles copy/paste automatically
- Numbers persist and increment intelligently
- Depends on libTokenMarkers (installed automatically with one-click)

---

## 5th Edition OGL by Roll20 Companion

**Usage:**

This script works automatically in the background with the 5e OGL character sheet. No commands are needed.

**Features:**

- Integrates sheet actions with other scripts
- Handles sheet-specific calculations
- Supports advantage/disadvantage mechanics
- Configuration through `!shaped-config` (if using Shaped sheet variant)

---

## libTokenMarkers

**Usage:**

This is a library script used by other scripts. It provides no direct commands but is required for:

- TokenNameNumber
- Other scripts that work with status markers

No user interaction needed - it works behind the scenes.

---

## TurnMarker1

**Usage:**

Provides a visual marker showing whose turn it is, auto-pings the map to center on the current token, and tracks combat rounds automatically.

**Initial Setup (run once):**

```
!tm autopull all
!tm toggle-animations
!tm toggle-rotate
```

**Basic Commands**

- `!tm` - Show current settings/status
- `!tm --help` - Display full help menu
- `!eot` - End current turn and advance to next (players can use this if their token is current)

**Configuration Commands**

- `!tm autopull all` - Auto-center map on current token's turn
- `!tm autopull gm` - Only GM sees auto-centering
- `!tm autopull off` - Disable auto-centering
- `!tm toggle-animations` - Turn marker animations on/off
- `!tm toggle-rotate` - Toggle spinning marker graphic
- `!tm toggle-announce` - Turn announcements in chat on/off
- `!tm reset` - Reset round counter to 0

**How It Works**

1. Install and run initial setup commands above
2. Roll initiative for tokens with `!group-init`
3. Sort turn order with `!group-init --sort`
4. A visual marker automatically appears under the current token
5. The map auto-centers on the current token (if autopull enabled)
6. A "Round" counter is added to turn tracker at initiative -1
7. Round counter automatically increments each time it's passed

**Features**

- **Visual Marker**: Spinning/pulsing graphic under current token
- **Auto-Ping**: Map centers on current token for all players
- **Round Counter**: Tracks combat rounds automatically
- **Turn Announcements**: Optional chat messages announcing whose turn it is
- **Player Control**: Players can use `!eot` to advance their own turn
- **Hidden Token Support**: Can skip or hide marker for hidden tokens

**Notes:**

- Marker automatically disappears when turn order is closed
- Round counter starts at Round 0 (surprise round) or Round 1
- Works seamlessly with GroupInitiative
- Players can only advance turn if they control the current token
- The marker image can be customized by changing the token graphic

---

## Tips & Best Practices

1. **Chain commands together** - Some scripts work well together (e.g., GroupInit + TokenMod)
2. **Save as macros** - Put frequently-used commands in macros for quick access
3. **Use token IDs** - Most scripts support `--ids @{target|token_id}` for precise targeting
4. **Multi-line for clarity** - Use `{{ }}` syntax in TokenMod for complex commands
5. **Test first** - Try commands on test tokens before using in-game
6. **Read help** - Most scripts have `--help` or similar commands showing all options

---

## Common Workflows

**Setting up a new monster token:**

```
!token-mod --set bar1_link|npc_hp bar1_value|[[8d8+16]] name|"Goblin Boss %%NUMBERED%%"
!ta
```

**Quick lighting setup (torch):**

```
!token-mod --on emits_bright_light emits_low_light --set bright_light_distance|20 low_light_distance|20 light_angle|360
```

**Group saving throw:**

```
!group-check --DEX-save --whisper
```

**Initiative for encounter:**

```
!group-init
!group-init --sort
```
