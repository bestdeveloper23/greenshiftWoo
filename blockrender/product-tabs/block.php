<?php


namespace greenshiftwoo\Blocks;

defined('ABSPATH') or exit;


class ProductTabs
{

	public function __construct()
	{
		add_action('init', array($this, 'init_handler'));
	}

	public function init_handler()
	{
		register_block_type(
			__DIR__,
			array(
				'render_callback' => array($this, 'render_block'),
				'attributes'      => $this->attributes
			)
		);
	}

	public $attributes = array(
		'id' => array(
			'type'    => 'string',
			'default' => null,
		),
		'inlineCssStyles' => array(
			'type'    => 'string',
			'default' => '',
		),
		'animation' => array(
			'type' => 'object',
			'default' => array(),
		),
		'sourceType'       => array(
			'type'    => 'string',
			'default' => 'latest_item',
		),
		'label'       => array(
			'type'    => 'string',
			'default' => '',
		),
		'postfix'       => array(
			'type'    => 'string',
			'default' => '',
		),
		'postId'       => array(
			'type'    => 'number',
			'default' => 0,
		),
		'panelType' => array(
			'type' => 'string',
			'default' => 'tabs'
		),
		'iconType' => array(
			'type' => 'string',
			'default' => 'up_down'
		)
	);

	public function render_block($settings = array(), $inner_content = '')
	{
		extract($settings);

		global $product;

        if($sourceType == 'latest_item'){
            global $product;
            if(is_object($product)){
                $postId = $product->get_id();
                $_product = $product;
            }else{
                global $post;
                if(is_object($post)){
                    $postId = $post->ID;
                }else{
                    $postId = 0;
                }
                $_product = gspbwoo_get_product_object_by_id($postId);
                $product = $_product;
            }
        }else{
            $postId = (isset($postId) && $postId > 0) ? (int)$postId : 0;
            $_product = gspbwoo_get_product_object_by_id($postId);
        }

		if(!$_product) return __('Product not found.', 'greenshiftwoo');
		
		wc_setup_product_data($_product->get_id());

		$tabs = $this->product_tabs($settings);

		if (!$_product) return __('Product not found.', 'greenshiftwoo');

		$blockId = 'gspb_id-' . $id;
		$blockClassName = 'gspb-' . $panelType . ' ' . $blockId . ' ' . (!empty($className) ? $className : '') . ' ';

		$out = '<div  class="' . $blockClassName . '"' . gspb_AnimationRenderProps($animation) . '>';
		$out .= $tabs;
		$out .= '</div>';
		return $out;
	}

	public function product_tabs($settings)
	{
		$product_tabs = apply_filters('woocommerce_product_tabs', array());

		$html = '';
		ob_start();
		if (!empty($product_tabs)) : ?>

			<?php if ($settings['panelType'] === 'tabs') : ?>
				<div class="gspb-tabs-wrapper gspb-tabs-type-tabs">
					<ul class="gspb-tabs-titles" role="tablist">
						<?php $i = 1;
						foreach ($product_tabs as $key => $product_tab) : ?>
							<li class="<?php echo esc_attr($key); ?>_tab <?php echo $i === 1 ? 'active' : '' ?>" id="tab-title-<?php echo esc_attr($key); ?>" role="tab" aria-controls="tab-<?php echo esc_attr($key); ?>">
								<a href="#tab-<?php echo esc_attr($key); ?>" class="gspb-tabs-title">
									<?php echo wp_kses_post(apply_filters('woocommerce_product_' . $key . '_tab_title', $product_tab['title'], $key)); ?>
								</a>
							</li>
						<?php $i++;
						endforeach; ?>
					</ul>
				</div>
				<?php $i = 1;
				foreach ($product_tabs as $key => $product_tab) : ?>
					<div class="gspb-tabs-panel gspb-tabs-panel--<?php echo esc_attr($key); ?> <?php echo $i === 1 ? 'active' : '' ?>" id="tab-<?php echo esc_attr($key); ?>" role="tabpanel" aria-labelledby="tab-title-<?php echo esc_attr($key); ?>">
						<?php
						if (isset($product_tab['callback'])) {
							if ($product_tab['callback'] !== 'woocommerce_product_description_tab') {
								call_user_func($product_tab['callback'], $key, $product_tab);
							} else {
								global $product;
								$heading = apply_filters('woocommerce_product_description_heading', __('Description', 'woocommerce'));
								if ($heading) : ?>
									<h2><?php echo esc_html($heading); ?></h2>
						<?php endif;

								echo  apply_filters('the_content', $product->get_description());
							}
						}
						?>
					</div>
				<?php $i++;
				endforeach; ?>

			<?php elseif($settings['panelType'] === 'sections') : ?>
				<div class="gspb-section-wrapper">

					<?php $i = 1;
					foreach ($product_tabs as $key => $product_tab) : ?>
						<div class="gspb-section-wrap">
							<div class="gspb-section-title">
								<?php echo wp_kses_post(apply_filters('woocommerce_product_' . $key . '_tab_title', $product_tab['title'], $key)); ?>
							</div>

							<div class="gspb-section-content" id="#section-<?php echo $key ?>">
								<?php
								if (isset($product_tab['callback'])) {
									if ($product_tab['callback'] !== 'woocommerce_product_description_tab') {
										call_user_func($product_tab['callback'], $key, $product_tab);
									} else {
										global $product;
										$heading = apply_filters('woocommerce_product_description_heading', __('Description', 'woocommerce'));
										if ($heading) : ?>
											<h2><?php echo esc_html($heading); ?></h2>
										<?php endif;
										echo  apply_filters('the_content', $product->get_description());
									}
								}
								?>
							</div>
						</div>
					<?php $i++;
					endforeach; ?>
				</div>
			<?php else : ?>
				<div class="gspb-toggle-wrapper gspb-toggle-icons-<?php echo $settings['iconType'] ?>">

					<?php $i = 1;
					foreach ($product_tabs as $key => $product_tab) : ?>
						<div class="gspb-toggle-wrap">
							<a href="#toggle-<?php echo $key ?>" class="gspb-toggle-link">
								<?php echo wp_kses_post(apply_filters('woocommerce_product_' . $key . '_tab_title', $product_tab['title'], $key)); ?>
							</a>

							<div class="gspb-toggle-content" id="#toggle-<?php echo $key ?>">
								<?php
								if (isset($product_tab['callback'])) {
									if ($product_tab['callback'] !== 'woocommerce_product_description_tab') {
										call_user_func($product_tab['callback'], $key, $product_tab);
									} else {
										global $product;
										$heading = apply_filters('woocommerce_product_description_heading', __('Description', 'woocommerce'));
										if ($heading) : ?>
											<h2><?php echo esc_html($heading); ?></h2>
								<?php endif;

										echo  apply_filters('the_content', $product->get_description());
									}
								}
								?>
							</div>
						</div>
					<?php $i++;
					endforeach; ?>
				</div>
			<?php endif; ?>

<?php endif;
		$html .= ob_get_contents();
		ob_get_clean();
		return $html;
	}
}

new ProductTabs;
