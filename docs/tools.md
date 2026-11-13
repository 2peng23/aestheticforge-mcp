# Tool reference

Generated from the executable registry. Every input schema below is the actual validated schema. All paths are within startup-authorized roots. All results appear as `structuredContent.result` and JSON text. Errors set `isError:true`.

Design compilation validates supplied facts/contracts; it does not independently author creative decisions. Source tools apply client-authored source. Browser audits are measured inventories/heuristics with limits explained in methodology.md.

## analyze_project

Inspect actual source files, manifest, framework evidence, route conventions and tokens.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## detect_framework

Detect installed frontend packages and Laravel files without running project commands.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## discover_pages

Discover file-convention routes and literal internal links; dynamic routes need runtime review.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## inspect_components

Inventory real component files and named exports.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## inspect_design_tokens

Extract actual CSS custom property declarations with source paths.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## analyze_existing_styles

Extract real typography, literal color, spacing and token declarations.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## identify_ui_inconsistencies

Report token overrides and literal style diversity; contextual differences need review.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## analyze_typography

Extract authored type declarations and scales; no invented typography quality score.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## audit_spacing

Inspect exact CSS spacing declarations and distinct authored values.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## audit_component_consistency

Compare source inventories, token overrides and exact duplicate components.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## validate_design_system

Validate static custom property references and report unresolved references for client review.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## detect_duplicate_components

Find byte-identical component sources using SHA-256, excluding unrelated files.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## inspect_component_api

Read a source file, exports/imports and hash needed for safe writes.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "file": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["file"],
  "additionalProperties": false
}
```

## implement_component

Apply AI-client-authored source exactly, preserving the framework. Default dry-run; existing files require expectedHash. Never executes source.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "file": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "source": {
      "type": "string",
      "maxLength": 2000000
    },
    "expectedHash": {
      "type": "string",
      "pattern": "^[a-f0-9]{64}$"
    },
    "dryRun": {
      "default": true,
      "type": "boolean"
    },
    "purpose": {
      "type": "string",
      "minLength": 10,
      "maxLength": 1000
    }
  },
  "required": ["file", "source", "dryRun", "purpose"],
  "additionalProperties": false
}
```

## implement_page

Apply AI-client-authored source exactly, preserving the framework. Default dry-run; existing files require expectedHash. Never executes source.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "file": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "source": {
      "type": "string",
      "maxLength": 2000000
    },
    "expectedHash": {
      "type": "string",
      "pattern": "^[a-f0-9]{64}$"
    },
    "dryRun": {
      "default": true,
      "type": "boolean"
    },
    "purpose": {
      "type": "string",
      "minLength": 10,
      "maxLength": 1000
    }
  },
  "required": ["file", "source", "dryRun", "purpose"],
  "additionalProperties": false
}
```

## refactor_component

Apply AI-client-authored source exactly, preserving the framework. Default dry-run; existing files require expectedHash. Never executes source.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "file": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "source": {
      "type": "string",
      "maxLength": 2000000
    },
    "expectedHash": {
      "type": "string",
      "pattern": "^[a-f0-9]{64}$"
    },
    "dryRun": {
      "default": true,
      "type": "boolean"
    },
    "purpose": {
      "type": "string",
      "minLength": 10,
      "maxLength": 1000
    }
  },
  "required": ["file", "source", "dryRun", "purpose"],
  "additionalProperties": false
}
```

## validate_component

Inspect basic source invariants and referenced local imports; application compiler remains authoritative.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "file": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["file"],
  "additionalProperties": false
}
```

## analyze_design_brief

Validate a product-specific client brief and compile its actual goals and content into requirements.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "product": {
      "type": "string",
      "minLength": 1,
      "maxLength": 160
    },
    "audience": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500
    },
    "primaryTask": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500
    },
    "personality": {
      "minItems": 1,
      "maxItems": 6,
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 80
      }
    },
    "constraints": {
      "default": [],
      "maxItems": 20,
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 500
      }
    },
    "content": {
      "minItems": 1,
      "maxItems": 30,
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 500
      }
    },
    "direction": {
      "type": "string",
      "enum": [
        "premium-saas",
        "luxury-editorial",
        "minimalist",
        "swiss",
        "enterprise",
        "creative-agency",
        "playful",
        "futuristic",
        "gaming",
        "dark",
        "ecommerce",
        "mobile-dashboard"
      ]
    },
    "rationale": {
      "type": "string",
      "minLength": 20,
      "maxLength": 2000
    }
  },
  "required": [
    "product",
    "audience",
    "primaryTask",
    "personality",
    "constraints",
    "content",
    "direction",
    "rationale"
  ],
  "additionalProperties": false
}
```

## generate_art_direction

Compile client-chosen art direction with rationale, audience, content and concrete constraints; no random aesthetic.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "product": {
      "type": "string",
      "minLength": 1,
      "maxLength": 160
    },
    "audience": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500
    },
    "primaryTask": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500
    },
    "personality": {
      "minItems": 1,
      "maxItems": 6,
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 80
      }
    },
    "constraints": {
      "default": [],
      "maxItems": 20,
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 500
      }
    },
    "content": {
      "minItems": 1,
      "maxItems": 30,
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 500
      }
    },
    "direction": {
      "type": "string",
      "enum": [
        "premium-saas",
        "luxury-editorial",
        "minimalist",
        "swiss",
        "enterprise",
        "creative-agency",
        "playful",
        "futuristic",
        "gaming",
        "dark",
        "ecommerce",
        "mobile-dashboard"
      ]
    },
    "rationale": {
      "type": "string",
      "minLength": 20,
      "maxLength": 2000
    }
  },
  "required": [
    "product",
    "audience",
    "primaryTask",
    "personality",
    "constraints",
    "content",
    "direction",
    "rationale"
  ],
  "additionalProperties": false
}
```

## evaluate_design_direction

Check supplied art direction against explicit brief requirements and measurable design constraints.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "brief": {
      "type": "object",
      "properties": {
        "product": {
          "type": "string",
          "minLength": 1,
          "maxLength": 160
        },
        "audience": {
          "type": "string",
          "minLength": 1,
          "maxLength": 500
        },
        "primaryTask": {
          "type": "string",
          "minLength": 1,
          "maxLength": 500
        },
        "personality": {
          "minItems": 1,
          "maxItems": 6,
          "type": "array",
          "items": {
            "type": "string",
            "maxLength": 80
          }
        },
        "constraints": {
          "default": [],
          "maxItems": 20,
          "type": "array",
          "items": {
            "type": "string",
            "maxLength": 500
          }
        },
        "content": {
          "minItems": 1,
          "maxItems": 30,
          "type": "array",
          "items": {
            "type": "string",
            "maxLength": 500
          }
        },
        "direction": {
          "type": "string",
          "enum": [
            "premium-saas",
            "luxury-editorial",
            "minimalist",
            "swiss",
            "enterprise",
            "creative-agency",
            "playful",
            "futuristic",
            "gaming",
            "dark",
            "ecommerce",
            "mobile-dashboard"
          ]
        },
        "rationale": {
          "type": "string",
          "minLength": 20,
          "maxLength": 2000
        }
      },
      "required": [
        "product",
        "audience",
        "primaryTask",
        "personality",
        "constraints",
        "content",
        "direction",
        "rationale"
      ],
      "additionalProperties": false
    },
    "direction": {
      "type": "string",
      "minLength": 10,
      "maxLength": 6000
    },
    "requirements": {
      "minItems": 1,
      "maxItems": 40,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "requirement": {
            "type": "string",
            "maxLength": 500
          },
          "met": {
            "type": "boolean"
          },
          "evidence": {
            "type": "string",
            "minLength": 5,
            "maxLength": 1000
          }
        },
        "required": ["requirement", "met", "evidence"],
        "additionalProperties": false
      }
    }
  },
  "required": ["brief", "direction", "requirements"],
  "additionalProperties": false
}
```

## create_design_tokens

Compile validated semantic light/dark tokens into actual CSS, with optional controlled file write.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "tokens": {
      "type": "object",
      "properties": {
        "colors": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
          }
        },
        "spacing": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "number",
            "minimum": 0,
            "maximum": 256
          }
        },
        "typography": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "string",
            "maxLength": 150
          }
        },
        "radii": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          }
        },
        "motion": {
          "type": "object",
          "properties": {
            "fast": {
              "type": "number",
              "minimum": 0,
              "maximum": 1000
            },
            "normal": {
              "type": "number",
              "minimum": 0,
              "maximum": 2000
            },
            "easing": {
              "type": "string",
              "maxLength": 100
            }
          },
          "required": ["fast", "normal", "easing"],
          "additionalProperties": false
        },
        "darkColors": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
          }
        }
      },
      "required": ["colors", "spacing", "typography", "radii", "motion"],
      "additionalProperties": false
    },
    "output": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "expectedHash": {
      "type": "string",
      "pattern": "^[a-f0-9]{64}$"
    },
    "dryRun": {
      "default": true,
      "type": "boolean"
    }
  },
  "required": ["tokens", "dryRun"],
  "additionalProperties": false
}
```

## generate_design_tokens

Compile validated semantic light/dark tokens into actual CSS, with optional controlled file write.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "tokens": {
      "type": "object",
      "properties": {
        "colors": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
          }
        },
        "spacing": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "number",
            "minimum": 0,
            "maximum": 256
          }
        },
        "typography": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "string",
            "maxLength": 150
          }
        },
        "radii": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          }
        },
        "motion": {
          "type": "object",
          "properties": {
            "fast": {
              "type": "number",
              "minimum": 0,
              "maximum": 1000
            },
            "normal": {
              "type": "number",
              "minimum": 0,
              "maximum": 2000
            },
            "easing": {
              "type": "string",
              "maxLength": 100
            }
          },
          "required": ["fast", "normal", "easing"],
          "additionalProperties": false
        },
        "darkColors": {
          "type": "object",
          "propertyNames": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "additionalProperties": {
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
          }
        }
      },
      "required": ["colors", "spacing", "typography", "radii", "motion"],
      "additionalProperties": false
    },
    "output": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "expectedHash": {
      "type": "string",
      "pattern": "^[a-f0-9]{64}$"
    },
    "dryRun": {
      "default": true,
      "type": "boolean"
    }
  },
  "required": ["tokens", "dryRun"],
  "additionalProperties": false
}
```

## validate_color_palette

Calculate WCAG solid sRGB contrast for explicit semantic color pairs.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "pairs": {
      "minItems": 1,
      "maxItems": 100,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "foreground": {
            "type": "string",
            "pattern": "^#[a-fA-F0-9]{6}$"
          },
          "background": {
            "type": "string",
            "pattern": "^#[a-fA-F0-9]{6}$"
          }
        },
        "required": ["foreground", "background"],
        "additionalProperties": false
      }
    }
  },
  "required": ["pairs"],
  "additionalProperties": false
}
```

## generate_component_spec

Validate and normalize the AI client component contract into an implementable specification.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "purpose": {
      "type": "string",
      "minLength": 10,
      "maxLength": 1000
    },
    "framework": {
      "type": "string",
      "maxLength": 100
    },
    "properties": {
      "maxItems": 40,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "maxLength": 100
          },
          "type": {
            "type": "string",
            "maxLength": 200
          },
          "required": {
            "type": "boolean"
          }
        },
        "required": ["name", "type", "required"],
        "additionalProperties": false
      }
    },
    "states": {
      "minItems": 1,
      "maxItems": 30,
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 300
      }
    },
    "acceptance": {
      "minItems": 1,
      "maxItems": 30,
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 5,
        "maxLength": 500
      }
    }
  },
  "required": [
    "name",
    "purpose",
    "framework",
    "properties",
    "states",
    "acceptance"
  ],
  "additionalProperties": false
}
```

## plan_component_system

Build an explicit component dependency graph and detect missing or cyclic dependencies.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "components": {
      "minItems": 1,
      "maxItems": 100,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100
          },
          "purpose": {
            "type": "string",
            "maxLength": 500
          },
          "dependsOn": {
            "maxItems": 30,
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 100
            }
          }
        },
        "required": ["name", "purpose", "dependsOn"],
        "additionalProperties": false
      }
    }
  },
  "required": ["components"],
  "additionalProperties": false
}
```

## analyze_responsive_layout

Inspect browser-rendered viewport, document, overflow, overlaps, touchTargets. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## detect_horizontal_overflow

Inspect browser-rendered viewport, document, overflow. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## detect_element_overlap

Inspect browser-rendered viewport, overlaps. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## audit_mobile_navigation

Inspect browser-rendered viewport, navigation, touchTargets, overflow. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## validate_touch_targets

Inspect browser-rendered viewport, touchTargets. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## audit_navigation

Inspect browser-rendered navigation, landmarks. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## audit_forms

Inspect browser-rendered forms. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## audit_information_hierarchy

Inspect browser-rendered headings, landmarks. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## audit_ui_states

Inspect browser-rendered states. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## audit_interaction_feedback

Inspect browser-rendered states, animations. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## analyze_motion_opportunities

Inspect browser-rendered animations, states. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## audit_animation_performance

Inspect browser-rendered animations. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## inspect_layout_geometry

Inspect browser-rendered viewport, document, overflow, overlaps, touchTargets, headings, landmarks. Results are measured evidence and labeled heuristics.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## capture_page_screenshot

Capture real rendered PNG with inputs and marked private content masked.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "output": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "fullPage": {
      "default": false,
      "type": "boolean"
    }
  },
  "required": ["url", "width", "height", "waitMs", "output", "fullPage"],
  "additionalProperties": false
}
```

## capture_viewport_matrix

Measure layout at explicit common and intermediate widths; optionally save masked screenshots.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "widths": {
      "default": [320, 375, 390, 430, 600, 768, 900, 1024, 1280, 1440, 1920],
      "minItems": 1,
      "maxItems": 15,
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 320,
        "maximum": 3840
      }
    },
    "outputDirectory": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["url", "width", "height", "waitMs", "widths"],
  "additionalProperties": false
}
```

## generate_responsive_report

Measure layout at explicit common and intermediate widths; optionally save masked screenshots.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "widths": {
      "default": [320, 375, 390, 430, 600, 768, 900, 1024, 1280, 1440, 1920],
      "minItems": 1,
      "maxItems": 15,
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 320,
        "maximum": 3840
      }
    },
    "outputDirectory": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["url", "width", "height", "waitMs", "widths"],
  "additionalProperties": false
}
```

## run_accessibility_audit

Run real axe-core WCAG2/2.1/2.2 AA rules; returns violations and incomplete checks, never a conformance claim.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## generate_accessibility_report

Run real axe-core WCAG2/2.1/2.2 AA rules; returns violations and incomplete checks, never a conformance claim.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## validate_semantics

Run real axe-core WCAG2/2.1/2.2 AA rules; returns violations and incomplete checks, never a conformance claim.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## inspect_keyboard_navigation

Exercise Tab navigation and collect actual active-element focus styles.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "steps": {
      "default": 12,
      "type": "integer",
      "minimum": 1,
      "maximum": 50
    }
  },
  "required": ["url", "width", "height", "waitMs", "steps"],
  "additionalProperties": false
}
```

## validate_focus_visibility

Exercise Tab navigation and collect actual active-element focus styles.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "steps": {
      "default": 12,
      "type": "integer",
      "minimum": 1,
      "maximum": 50
    }
  },
  "required": ["url", "width", "height", "waitMs", "steps"],
  "additionalProperties": false
}
```

## audit_user_flow

Execute explicit safe browser interaction steps against the real app; sensitive form fields blocked.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "actions": {
      "maxItems": 30,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "click",
              "fill",
              "press",
              "scroll",
              "wait",
              "expect-visible",
              "expect-text",
              "expect-count"
            ]
          },
          "selector": {
            "type": "string",
            "maxLength": 500
          },
          "value": {
            "type": "string",
            "maxLength": 1000
          },
          "x": {
            "type": "number",
            "minimum": -2000,
            "maximum": 2000
          },
          "y": {
            "type": "number",
            "minimum": -10000,
            "maximum": 10000
          },
          "milliseconds": {
            "type": "integer",
            "minimum": 0,
            "maximum": 2000
          }
        },
        "required": ["type"],
        "additionalProperties": false
      }
    }
  },
  "required": ["url", "width", "height", "waitMs", "actions"],
  "additionalProperties": false
}
```

## validate_interaction

Execute explicit safe browser interaction steps against the real app; sensitive form fields blocked.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "actions": {
      "maxItems": 30,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "click",
              "fill",
              "press",
              "scroll",
              "wait",
              "expect-visible",
              "expect-text",
              "expect-count"
            ]
          },
          "selector": {
            "type": "string",
            "maxLength": 500
          },
          "value": {
            "type": "string",
            "maxLength": 1000
          },
          "x": {
            "type": "number",
            "minimum": -2000,
            "maximum": 2000
          },
          "y": {
            "type": "number",
            "minimum": -10000,
            "maximum": 10000
          },
          "milliseconds": {
            "type": "integer",
            "minimum": 0,
            "maximum": 2000
          }
        },
        "required": ["type"],
        "additionalProperties": false
      }
    }
  },
  "required": ["url", "width", "height", "waitMs", "actions"],
  "additionalProperties": false
}
```

## validate_page_states

Execute explicit safe browser interaction steps against the real app; sensitive form fields blocked.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "actions": {
      "maxItems": 30,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "click",
              "fill",
              "press",
              "scroll",
              "wait",
              "expect-visible",
              "expect-text",
              "expect-count"
            ]
          },
          "selector": {
            "type": "string",
            "maxLength": 500
          },
          "value": {
            "type": "string",
            "maxLength": 1000
          },
          "x": {
            "type": "number",
            "minimum": -2000,
            "maximum": 2000
          },
          "y": {
            "type": "number",
            "minimum": -10000,
            "maximum": 10000
          },
          "milliseconds": {
            "type": "integer",
            "minimum": 0,
            "maximum": 2000
          }
        },
        "required": ["type"],
        "additionalProperties": false
      }
    }
  },
  "required": ["url", "width", "height", "waitMs", "actions"],
  "additionalProperties": false
}
```

## test_reduced_motion

Compare actual animations under normal and reduced-motion emulation.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## generate_interaction_spec

Compile explicit state transition graph and check all referenced states exist.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "component": {
      "type": "string",
      "maxLength": 100
    },
    "states": {
      "minItems": 1,
      "maxItems": 30,
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 100
      }
    },
    "transitions": {
      "maxItems": 100,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "from": {
            "type": "string",
            "maxLength": 100
          },
          "to": {
            "type": "string",
            "maxLength": 100
          },
          "trigger": {
            "type": "string",
            "maxLength": 200
          },
          "durationMs": {
            "type": "number",
            "minimum": 0,
            "maximum": 2000
          },
          "property": {
            "type": "string",
            "enum": ["transform", "opacity", "color", "height", "width"]
          },
          "reducedMotion": {
            "type": "string",
            "minLength": 5,
            "maxLength": 300
          }
        },
        "required": [
          "from",
          "to",
          "trigger",
          "durationMs",
          "property",
          "reducedMotion"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": ["component", "states", "transitions"],
  "additionalProperties": false
}
```

## compare_screenshots

Compare real PNG pixels with pixelmatch and optional diff artifact; changes are not quality judgments.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "before": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "after": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "output": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "threshold": {
      "default": 0.1,
      "type": "number",
      "minimum": 0,
      "maximum": 1
    }
  },
  "required": ["before", "after", "threshold"],
  "additionalProperties": false
}
```

## detect_visual_regression

Compare real PNG pixels with pixelmatch and optional diff artifact; changes are not quality judgments.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "before": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "after": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "output": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "threshold": {
      "default": 0.1,
      "type": "number",
      "minimum": 0,
      "maximum": 1
    }
  },
  "required": ["before", "after", "threshold"],
  "additionalProperties": false
}
```

## inspect_asset_sizes

Measure actual local asset file bytes; no invented transfer savings.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["project"],
  "additionalProperties": false
}
```

## analyze_rendering_performance

Measure navigation/resource/paint timings and observed layout shifts in a real browser lab session.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## detect_layout_shift

Measure navigation/resource/paint timings and observed layout shifts in a real browser lab session.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## generate_performance_report

Measure navigation/resource/paint timings and observed layout shifts in a real browser lab session.

Potential file/app mutation: no.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## run_lighthouse_audit

Run optional installed Lighthouse via bounded Node CLI. Requires explicit network permission; Lighthouse may fetch third-party page resources.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "output": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    },
    "allowNetwork": {
      "type": "boolean",
      "const": true
    }
  },
  "required": ["url", "width", "height", "waitMs", "output", "allowNetwork"],
  "additionalProperties": false
}
```

## generate_ux_report

Combine actual rendered geometry, axe and focus evidence into a review report; client judges subjective design.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "output": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```

## generate_visual_review

Combine actual rendered geometry, axe and focus evidence into a review report; client judges subjective design.

Potential file/app mutation: yes (dry-run where offered).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 4096,
      "format": "uri"
    },
    "width": {
      "default": 1440,
      "type": "integer",
      "minimum": 320,
      "maximum": 3840
    },
    "height": {
      "default": 900,
      "type": "integer",
      "minimum": 320,
      "maximum": 2160
    },
    "waitMs": {
      "default": 0,
      "type": "integer",
      "minimum": 0,
      "maximum": 5000
    },
    "output": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4096
    }
  },
  "required": ["url", "width", "height", "waitMs"],
  "additionalProperties": false
}
```
